import React, {Component } from 'react';
import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE =  'https://hn.algolia.com/api/v1'

const PATH_SEARCH = '/search';

const PARAM_SEARCH = 'query=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    result : null,
    searchTerm: DEFAULT_QUERY
    };
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this)

  }
  setSearchTopStories(result) {
    this.setState({ result });
  }
  componentDidMount() {
    const { searchTerm } = this.state;

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }
  render() {
    const { searchTerm, result } = this.state
    return (
      <div className="App">
      {this.state.list.map( item =>
      <div key ={item.objectIdD}>
        <span>
          <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
      </div>
      )}
      </div>
    )
  }
}

export default App;
