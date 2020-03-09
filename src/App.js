import React, {Component } from 'react';
import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux';

const DEFAULT_HPP = '100';

const PATH_BASE =  'https://hn.algolia.com/api/v1'

const PATH_SEARCH = '/search';

const PARAM_SEARCH = 'query=';

const PARAM_PAGE = 'page=';

const PARAM_HPP = 'hitsPerPage=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}`;

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
    searchKey: '',
    searchTerm: DEFAULT_QUERY
    };
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this)

  }
  setSearchTopStories(result) {
    const { hits, page} = result;

    const oldHits = page !== 0
    ? this.state.result.hits
    : [];
    
    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      result: { hits: updatedHits, page }
    });
  }
  // componentDidMount() {
  //   const { searchTerm } = this.state;
  //   this.fetchSearchTopStories(searchTerm);


    fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
    }
    componentDidMount() {
      const { searchTerm } = this.state;
      this.setState({ searchKey: searchTerm });
      this.fetchSearchTopStories(searchTerm);
  }

  onSearchSubmit(event) {
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }
  render() {
    const { searchTerm, result } = this.state;
    const page = (result && result.page) || 0;
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
          <div className="interactions">
            <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
              More
            </Button>
          </div>
     
      </div>
    )
  }
}

export default App;
