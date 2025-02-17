import { useEffect, useRef } from 'react';
import { StyledHeading, StyledPagination, StyledText } from './SearchPage.styles';
import { Container, Grid, CircularProgress } from '@mui/material';
import ResultCard from '../ResultCard/ResultCard';
import { useSearchParams } from 'react-router-dom';

const SearchPage = ({ 
  setSearchTerm, 
  handleSearch, 
  results, 
  searchedTerm, 
  pagination, 
  handlePageChange, 
  loading,
  onResultClick 
}) => {
  const [searchParams] = useSearchParams();
  const term = searchParams.get('term') || '';
  const initialSearchPerformed = useRef(false);

  // Track page view when component mounts
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'search_page_view', {
        search_term: term || searchedTerm,
        results_count: pagination?.totalResults || 0
      });
    }
  }, [term, searchedTerm, pagination?.totalResults]);

  useEffect(() => {
    if (term && !initialSearchPerformed.current) {
      setSearchTerm(term);
      handleSearch({ preventDefault: () => { } }, term);
      initialSearchPerformed.current = true;

      // Track initial search from URL parameter
      if (window.gtag) {
        window.gtag('event', 'url_parameter_search', {
          search_term: term
        });
      }
    }
  }, [term, setSearchTerm, handleSearch]);

  // Track when users reach bottom of results
  useEffect(() => {
    const handleScroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100) {
        if (window.gtag) {
          window.gtag('event', 'scroll_to_bottom', {
            search_term: searchedTerm || term,
            page_number: pagination.currentPage,
            results_count: pagination.totalResults
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [searchedTerm, term, pagination]);

  const handleResultCardClick = (data) => {
    if (window.gtag) {
      window.gtag('event', 'result_click', {
        result_id: data.id,
        search_term: searchedTerm || term,
        position: results.indexOf(data) + 1 + ((pagination.currentPage - 1) * 10),
        page_number: pagination.currentPage
      });
    }
    if (onResultClick) {
      onResultClick(data);
    }
  };

  const handlePaginationChange = (event, page) => {
    // Track pagination interaction
    if (window.gtag) {
      window.gtag('event', 'pagination_change', {
        from_page: pagination.currentPage,
        to_page: page,
        search_term: searchedTerm || term,
        results_per_page: 10
      });
    }
    handlePageChange(page);
  };

  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress style={{ color: 'white', width: '100px', height: '100px' }} />
      </Container>
    );
  }

  return (
    <>
      <StyledHeading variant="h6" component="h6" gutterBottom>
        Found {pagination?.totalResults > 200 ? "200+" : pagination?.totalResults.toLocaleString()} results for "{searchedTerm || term}"
      </StyledHeading>
      <Container style={{ paddingLeft: 0, paddingRight: 0 }}>
        <Grid container spacing={4}>
          {results.map((data, index) => (
            <Grid item xs={12} sm={12} md={12} lg={12} key={index}>
              <ResultCard 
                data={data} 
                searchedTerm={searchedTerm}
                onClick={() => handleResultCardClick(data)}
              />
            </Grid>
          ))}
        </Grid>
        {pagination.totalResults > 1 && (
          <Grid container justifyContent="center" style={{ margin: 'auto', marginTop: '20px', maxWidth: 500 }}>
            <StyledPagination
              count={Math.min(pagination.totalPages, 20)}
              page={pagination.currentPage}
              onChange={handlePaginationChange}
              showFirstButton
              showLastButton
            />
            <StyledHeading variant="body2">
              10 results per page, max 200 results
            </StyledHeading>
          </Grid>
        )}
      </Container>
    </>
  );
}

export default SearchPage;