import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

export const StyledSearchContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '50%',
  maxWidth: '600px',
  height: '40px',
  borderRadius: '4px',
  backgroundColor: theme.palette.common.white,
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  marginLeft: 'auto', // Align to the right
  marginRight: 'auto', // Align to the left
  '& .MuiInputBase-root': {
    color: theme.palette.text.primary,
  },
  '& .MuiInputBase-input::placeholder': {
    color: theme.palette.text.secondary,
    opacity: 0.7,
  },
  '& .MuiIconButton-root': {
    padding: '8px',
    color: theme.palette.text.secondary,
  },
}));