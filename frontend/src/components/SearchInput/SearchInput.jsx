import { useRef } from 'react';
import { InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search.js';
import { StyledSearchContainer } from './SearchInput.styles.js';
import { useNavigate } from 'react-router-dom';

function SearchInput({ searchTerm, setSearchTerm, handleSearch }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?term=${encodeURIComponent(searchTerm.trim())}`);
      handleSearch(e);
      if (inputRef.current) {
        inputRef.current.blur(); // Hide the mobile keyboard
      }
    }
  };

  return (
    <StyledSearchContainer component="form" onSubmit={handleSubmit}>
      <InputBase
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        sx={{ ml: 2, flex: 1 }}
        inputProps={{ 'aria-label': 'search' }}
        inputRef={inputRef} // Attach the ref to the InputBase component
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </StyledSearchContainer>
  );
}

export default SearchInput;