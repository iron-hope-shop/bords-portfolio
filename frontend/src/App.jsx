import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { BackgroundContainer, ScrollableContent, PaddingBox } from './App.styles';
import './App.css';
import Home from './components/Home/Home';
import SearchPage from './components/SearchPage/SearchPage';
import View from './components/View/View';
import Compare from './components/Compare/Compare';
import Favorites from './components/Favorites/Favorites';
import TopBar from './components/TopBar/TopBar';
import axios from 'axios';
import About from './components/About/About';

// Route tracking component
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_location: window.location.href,
        page_path: location.pathname + location.search,
        page_title: document.title
      });
    }
  }, [location]);

  return null;
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedTerm, setSearchedTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalResults: 0,
    totalPages: 0
  });
  const [conditions, setConditions] = useState([]);

  const VALID_INDICES = [
    'conditions', 'identifiers', 'inputs', 'notes',
    'outcomes', 'provenance', 'reaction_id', 'id'
  ];

  const searchFields = {};
  const resultFields = {};

  VALID_INDICES.forEach(field => {
    searchFields[field] = {};
    resultFields[field] = { raw: {} };
  });

  const handleApplyConditions = (newConditions) => {
    setConditions(newConditions);
    if (window.gtag) {
      window.gtag('event', 'apply_filters', {
        filter_count: newConditions.length,
        filter_types: newConditions.map(c => c.type).join(',')
      });
    }
    console.log('Applying conditions:', newConditions);
  };

  const handleSearch = async (event, termToSearch = searchTerm, page = 1) => {
    event.preventDefault();
    if (!termToSearch || isSearching) return;

    // Track search initiation
    if (window.gtag) {
      window.gtag('event', 'search', {
        search_term: termToSearch,
        page_number: page,
        conditions_count: conditions.length
      });
    }

    const payload = {
      query: termToSearch,
      search_fields: searchFields,
      result_fields: resultFields,
      page,
      size: 10,
      conditions: conditions
    }

    setSearchedTerm(termToSearch);
    setIsSearching(true);

    try {
      const response = await axios.post('https://bordsearch.com/api/read/search', payload);
      
      // Track successful search
      if (window.gtag) {
        window.gtag('event', 'search_complete', {
          search_term: termToSearch,
          results_count: response.data.pagination.totalResults,
          page_number: page
        });
      }

      setResults(response.data.results);
      setPagination(response.data.pagination);
      console.log(response);
    } catch (error) {
      // Track failed search
      if (window.gtag) {
        window.gtag('event', 'search_error', {
          search_term: termToSearch,
          error_message: error.message,
          page_number: page
        });
      }

      console.error('Error performing search:', error);
      setResults([]);
      setPagination({
        currentPage: 1,
        pageSize: 10,
        totalResults: 0,
        totalPages: 2
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handlePageChange = (newPage) => {
    // Track pagination event
    if (window.gtag) {
      window.gtag('event', 'pagination', {
        from_page: pagination.currentPage,
        to_page: newPage,
        search_term: searchedTerm
      });
    }
    
    console.log('Changing page to:', newPage);
    handleSearch({ preventDefault: () => { } }, searchedTerm, newPage);
  };

  // Function to handle result clicks
  const handleResultClick = (result) => {
    if (window.gtag) {
      window.gtag('event', 'select_result', {
        result_id: result.id,
        search_term: searchedTerm,
        page_number: pagination.currentPage
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <RouteTracker />
        <TopBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          handleSearch={handleSearch}
          onApplyConditions={handleApplyConditions}
        />
        <BackgroundContainer />
        <ScrollableContent>
          <PaddingBox>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={
                <SearchPage
                  setSearchTerm={setSearchTerm}
                  handleSearch={handleSearch}
                  results={results}
                  searchedTerm={searchedTerm}
                  pagination={pagination}
                  handlePageChange={handlePageChange}
                  loading={isSearching}
                  onResultClick={handleResultClick}  // Add this prop
                />
              } />
              <Route path="/about" element={<About />} />
              <Route path="/view" element={<View />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </PaddingBox>
        </ScrollableContent>
      </Router>
    </ThemeProvider>
  );
}

export default App;