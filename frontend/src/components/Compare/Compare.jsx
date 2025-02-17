import { Typography, Box, List, ListItem, ListItemText, Paper } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

function Compare() {
  const [searchParams] = useSearchParams();
  const ids = searchParams.get('ids')?.split(',') || [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Compare Page
      </Typography>
      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Comparing Items
        </Typography>
        <List>
          {ids.map((id, index) => (
            <ListItem key={index}>
              <ListItemText primary={`Item ${index + 1}`} secondary={`ID: ${id}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default Compare;