import { Typography, Box, TextField } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

function Search() {
  const [searchParams] = useSearchParams();
  const term = searchParams.get('term') || '';

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Search Page
      </Typography>
      <TextField
        label="Search Term"
        variant="outlined"
        value={term}
        fullWidth
        margin="normal"
        InputProps={{
          readOnly: true,
        }}
      />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Searching for: {term}
      </Typography>
    </Box>
  );
}

export default Search;