import { Typography, Box } from '@mui/material';

function Favorites() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        favorites
      </Typography>
      <Typography variant="body1">
        Ids
      </Typography>
    </Box>
  );
}

export default Favorites;