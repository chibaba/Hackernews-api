import React, {Component } from 'react';
import axios from 'axios';
import { sortBy } from 'loadash';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './App.css';

const DEFAULT_QUERY = 'redux';

const DEFAULT_HPP = '100';

const PATH_BASE =  'https://hn.algolia.com/api/v1'

const PATH_SEARCH = '/search';

const PARAM_SEARCH = 'query=';

const PARAM_PAGE = 'page=';

const PARAM_HPP = 'hitsPerPage=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}`;



  const Button = ({
    onClick,
    className,
    children,
  }) => 
  <button
  onClick={onClick}
  className={className} 
  type='button'>
    {children}
  </button>

  const Loading = () =>
  <div>Loading ...</div>

  const withLoading = (Component) => ({isLoading, ...rest}) =>
  isLoading
  ? <Loading />
  : <Component {...rest} />

  const ButtonWithLoading = withLoading(Button);

  Button.defaultProps = {
    className: ''
  }

  Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
  }
  Table.propTypes = {
    list: PropTypes.array.isRequired,
    onDismiss: PropTypes.func.isRequired,
  }
  Table.propTypes = {
    list: PropTypes.arrayOf(
      PropTypes.shape({
        objectID: PropTypes.string.isRequired,
        author: PropTypes.string,
        url: PropTypes.string,
        num_comments: PropTypes.number,
        points: PropTypes.number,
      })
    ).isRequired,
    onDismiss: PropTypes.func.isRequired,
  };
  const SORTS = {
    NONE: list => list,
    TITLE: list =>sortBy(list, 'title'),
    AUTHOR: list=>sortBy(list, 'author'),
    COMMENTS: list=>sortBy(list, 'num_comments').reverse(),
    POINTS: list=>sortBy(list, 'points').reverse(),
  };

class App extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    // render() {
    //   const {
   
        // results,
        // searchKey,
        // searchTerm,
        // error,
        // isLoading
        //   } = this.state;
        this.state = {
          results: null,
          searchKey: '',
          searchTerm: DEFAULT_QUERY,
          error: null,
          isLoading: false,
          sortKey: 'NONE',
          isSortReverse: false,
        };
        
    
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSort = this.onSort.bind(this);

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
        [searchKey]:  { hits: updatedHits, page} },
        isLoading: false
    });
  }


    fetchSearchTopStories(searchTerm, page = 0) {
      this.setState({ isLoading: true });

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
  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse})
    this.setState({ sortKey, isSortReverse });
  }

  render() {
    const { searchTerm, results,searchKey, error, isLoading,sortKey } = this.state;
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
        sortKey={sortKey}
        onSort={this.onSort}
        onDismiss ={this.onDismiss} />
      }
      
          <div className="interactions">
          <ButtonWithLoading
           isLoading={isLoading}
           onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
             More
           </ButtonWithLoading>
          
          </div>
     
      </div>
    );
  }
}
class Search extends Component {
  componentDidMount() {
    if(this.input) {
      this.input.focus();
    }
  }
render() {
const Search = ({
  value,
  onChange,
  onSubmit,
  children
}) => {
  let input
 return (
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
      ref={(node) => input = node}
      />
      <button type="submit">
        { children }
      </button>
  </form>
 );
}
}
}

const Sort = ({ sortKey, activeSortKey, onSort, children }) => {
  const sortClass = classNames(
    'button-inline',
    {'button-active': sortKey === activeSortKey}
  );

  // if(sortKey === activeSortKey) {
  //   sortClass.push('button-active')
  // }
  return (
  <Button
     onClick={() => onSort(sortKey)}
     className= { sortClass}
     >
       {children}
     </Button>
     )
}

  
    class Table extends Component {
      render () {
        const {
          list,
          sortKey,
          isSortReverse,
          onSort,
          onDismiss,
        } = this.props;

            

    
      const sortedList = SORTS[sortKey](list);
      const reverseSortedList = isSortReverse
      ?  sortedList.reverse()
      : sortedList;
      return (
    
      <div className="table">
      <div className="table-header">
        <span style={{ width: '40%'}}>
          <Sort
          sortKey={'TITLE'}
          onSort={onSort}
          activeSortKey={sortKey}
          >
            Title
          </Sort>
        </span>
        <span style={{ width: '30%' }}>
          <Sort
           sortKey={'AUTHOR'}
           onSort={onSort}
           activeSortKey={sortKey}
           >
             Author
           </Sort>
        </span>
        <span style={{ width: '10'}}>
          <Sort
          sortKey={'COMMENTS'}
          onSort={onSort}
          activeSortKey={sortKey}
          >
            Comments
          </Sort>
        </span>
        <span style={{ width: '10%'}}>
          <Sort
          sortKey={'POINTS'}
          onSort={onSort}
          activeSortKey={sortKey}
          >
            Points
          </Sort>
        </span>
        <span style={{ width: '10%'}}>
          Archive
        </span>
      </div>
              { reverseSortedList.map(item =>
        <div key={item.objectID} className="table-row">
        <span style={{ width: '40%'}}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width : '30%'}}>{item.author}</span>
        <span style={{ width: '10%'}}>{item.num_comments}</span>
        <span class={{ width: '10%'}}>{item.points}</span>
        <span style={{ width: '10%'}}>
          <Button onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            Dismiss
          </Button>
        </span>
        </div>
        )}
      </div>
      );

              }
            }
  



export default App;

export {
  Button,
  Search,
  Table,
};
