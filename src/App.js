import React, {Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

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

  const Button = ({
    onClick,
    className= '',
    children,
  }) => 
  <button
  onClick={onClick}
  className={className} 
  type='button'>
    {children}
  </button>

  Button.propTypes = {
    onClick: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.node,
  }

class App extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
    results : null,
    searchKey: '',
    searchTerm: DEFAULT_QUERY,
    error: null
    };
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this)

  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm]; 
  }
  setSearchTopStories(result) {
    const { hits, page} = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];
    
    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      results: { ...results,
        [searchKey]:  { hits: updatedHits, page} }
    });
  }
  // componentDidMount() {
  //   const { searchTerm } = this.state;
  //   this.fetchSearchTopStories(searchTerm);


    fetchSearchTopStories(searchTerm, page = 0) {
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({error}));
    }  // componentDidMount() {
      //   const { searchTerm } = this.state;
      //   this.fetchSearchTopStories(searchTerm);
    componentDidMount() {
      this._isMounted = true;
      const { searchTerm } = this.state;
      this.setState({ searchKey: searchTerm });
      this.fetchSearchTopStories(searchTerm);
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  onSearchSubmit(event) {
    const {searchTerm} = this.state;
    this.setState({ searchKey: searchTerm })

    if(this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }
  onDismiss(id) {
    const { searchKey, results } = this.state;
    const {hits, page } = results[searchKey];

    const isNotId = item =>item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    })
  }
  render() {
    const { searchTerm, results,searchKey, error } = this.state;
    const page = (result && results[searchKey] &&
                  results[searchKey].page) || 0;
    const list = (
      results &&
      results[searchKey] && results[searchKey].hits
    )
    if(error) {
      return <p>Something went wrong.</p>
    }
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
      {
        error
        ? <div className= "interactions">
          <p> Something went wrong </p>
        </div>
     : <Table
        list={list}
        onDismiss ={this.onDismiss} />
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

export {
  Button,
  Search,
  Table,
};
