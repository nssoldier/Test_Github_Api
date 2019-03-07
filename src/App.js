import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

class Stargazersdetails extends Component {

  render() {
    return (
      <div>
        <div className="StarGazers">- {this.props.namestargazers}</div>
      </div>
    );
  }
}

class ReposDetails extends Component {
  ViewStarGazers = () => {
    this.props.ViewStarGazers(this.props.index)
  }
  LoadMoreStarGazers = () => {
    this.props.LoadMoreStarGazers(this.props.index)
  }
  render() {
    var liststar = "";
    var btnloadmore = "";
    if (this.props.value.stargazers !== undefined) {
      liststar = this.props.value.stargazers.map((data, index) => {
        return (<Stargazersdetails key={index} namestargazers={data.login} />);
      });
      btnloadmore = <button onClick={this.LoadMoreStarGazers}>Load more...</button>
    }
    var id = "btn-view" + this.props.index;
    return (

      <div>
        <div>
          <div className="Repos">* {this.props.namerepos}</div> <span>({liststar.length}/{this.props.value.stargazers_count}) stars</span>
          <button id={id} onClick={this.ViewStarGazers}>View</button>
        </div>
        <div>{liststar}</div>
        {btnloadmore}
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      searchuser: "",
      user: "",
      repos: [],
      pagerepos: 1,
      reposindex: -1,
      loadmorestar: false
    })
  }
  componentDidUpdate(prevProps, prevState) {
    var urllistrepos;
    if (this.state.user !== prevState.user) {
      urllistrepos = "https://api.github.com/users/" + this.state.user + "/repos?per_page=5";
      fetch(urllistrepos).then(responselistrepos => {
        if (responselistrepos.status === 200) {
          return responselistrepos.json()
        }
        else {
          alert("error " + responselistrepos.statusText)
        }
      }).then(reposdetails => {
        this.setState({
          repos: reposdetails
        });

      })
    }
    if (this.state.pagerepos !== prevState.pagerepos) {
      urllistrepos = "https://api.github.com/users/" + this.state.user + "/repos?per_page=5&page=" + this.state.pagerepos;
      fetch(urllistrepos).then(responselistrepos => {
        if (responselistrepos.status === 200) {
          return responselistrepos.json()
        }
        else {
          alert("error " + responselistrepos.statusText)
        }
      }).then(reposdetails => {
        this.setState({ repos: this.state.repos.concat(reposdetails) });
      })
    }

    // if (this.state.repos !== prevState.repos) {

    // }

    if (this.state.reposindex !== prevState.reposindex && this.state.repos !== prevState.repos) {
      let x = this.state.repos.slice();
      let index = 0;
      for (var i = 0; i < this.state.repos.length; i++) {
        if (this.state.repos[i].page >= 1) {
          index = i;
        }
      }
      if (this.state.repos[index].page !== undefined ) {

        if (this.state.repos[index].page === 1) {
          fetch(this.state.repos[index].stargazers_url + "?per_page=5").then(response => {
            if (response.status === 200) {
              return response.json()
            }
            else {
              alert("error " + response.statusText)
            }
          }).then(responsestar => {
            x[index].stargazers = responsestar;

            this.setState({ repos: x });
          })
        }
        else if (this.state.repos[index].page > 1 && this.state.loadmorestar === true) {
          fetch(this.state.repos[index].stargazers_url + "?per_page=5&page=" + this.state.repos[index].page).then(response => {
            if (response.status === 200) {
              return response.json()
            }
            else {
              alert("error " + response.statusText)
            }
          }).then(responsestar => {
            x[index].stargazers = this.state.repos[index].stargazers.concat(responsestar);

            this.setState({ repos: x ,loadmorestar: false});
          })
        }

      }
    }

  }
  OnInput = (e) => {
    this.setState({ searchuser: e.target.value });
  }
  OnEnter = (e) => {
    if (e.key === "Enter") {
      this.setState({ user: this.state.searchuser });
      document.getElementById("search-user").value = "";
    }
  }
  ViewStarGazers = (value) => {
    this.setState({ reposindex: value });
    let x = this.state.repos.slice();
    x[value].page = 1;
    this.setState({ repos: x });
  }
  LoadRepos = () => {
    this.setState({ pagerepos: this.state.pagerepos + 1 });
  }
  LoadMoreStarGazers = (value) => {
    let x = this.state.repos.slice();
    x[value].page = this.state.repos[value].page + 1;
    this.setState({
      repos: x,
      loadmorestar: true});
    console.log(this.state.repos[value].page);
  }
  render() {
    var reposdetails = "";
    // var d = new Date(1551899310 * 1000);
    // var x = d.toString();
    if (this.state.repos.length !== 0) {
      reposdetails = this.state.repos.map((data, index) => {
        return (<ReposDetails key={index} namerepos={data.name} index={index} ViewStarGazers={this.ViewStarGazers} LoadMoreStarGazers={this.LoadMoreStarGazers} value={data} />);
      });
      var loadbutton = <button onClick={this.LoadRepos}>Load more...</button>;
    }


    return (
      <div>
        <input id="search-user" placeholder="Input github user name then enter" onChange={this.OnInput} onKeyPress={this.OnEnter}></input>
        <div>
          {reposdetails}
        </div>
        {loadbutton}
      </div>
    );
  }
}

export default App;
