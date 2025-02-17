// ConditionPanel.styles.js
import { styled } from '@mui/material/styles';
import { Paper, Box, Select, TextField } from '@mui/material';

export const StyledConditionPanel = styled(Paper)(({ theme }) => ({
  position: 'sticky',
  top: '58px', // Adjust this value based on your AppBar height
  left: 0,
  right: 0,
  zIndex: 10,
  padding: theme.spacing(2),
  paddingTop: theme.spacing(1.75),
  backgroundColor: theme.palette.secondary.w,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  overflowY: 'auto', // Enable vertical scrolling
  maxHeight: 'calc(100vh - 64px)', // Adjust based on your layout
  marginBottom: 0,
}));

export const StyledConditionItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    padding: theme.spacing(1),
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    padding: theme.spacing(1),
  },
}));