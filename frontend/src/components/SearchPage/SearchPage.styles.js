import { styled } from '@mui/material/styles';
import { Typography, Pagination } from '@mui/material';

const StyledText= styled(Typography)(({ theme }) => ({
  color: `${theme.palette.accent.w}`,
  marginBottom: theme.spacing(4),
}));

const StyledHeading = styled(Typography)(({ theme }) => ({
  color: `${theme.palette.accent.w}`,
}));

const StyledPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    color: theme.palette.accent.w,
    '&.Mui-selected': {
      backgroundColor: theme.palette.accent.main,
      color: theme.palette.accent.w,
      '&:hover': {
        backgroundColor: theme.palette.accent.dark,
      },
    },
    '&:hover': {
      backgroundColor: theme.palette.accent.light,
    },
  },
}));

export { StyledText, StyledHeading, StyledPagination };