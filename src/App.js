import React, {Component } from 'react';
import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE =  'https://hn.algolia.com/api/v1'

const PATH_SEARCH = '/search';

const PARAM_SEARCH = 'query=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`

const Search = ({
  value,
  onChange,
  onSubmit,
  children
}) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
      />
      <button type="submit">
        { children }
      </button>
  </form>

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    result : null,
    searchTerm: DEFAULT_QUERY
    };
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this)

  }
  setSearchTopStories(result) {
    this.setState({ result });
  }
  componentDidMount() {
    const { searchTerm } = this.state;

    fetchSearchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
    
      .catch(error => error);
    }
    componentDidMount() {
      const { searchTerm } = this.state;
      this.fetchSearchTopStories(searchTerm);
  }

  onSearchSubmit(event) {
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }
  render() {
    const { searchTerm, result } = this.state
    return (
      <div className="Page">
      <div className='interactions'>
        <Search
        value={searchTerm}
        onChange={this.onSearchChange}
        onSubmit = {this.onSearchSubmit}
        >
        Search

        </Search>

      </div>

    const Table = ({ list, onDismiss}) =>
      <div className="table">
        {list.map(item =>

        )}
      </div>
      { result &&
        <Table
          list={result.hits}
          //pattern={searchTerm}
          onDismiss={this.onDismiss}
          />
          
          }
     
      </div>
    )
  }
}

export default App;
