import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  borderBottom: `1px solid rgba(36, 51, 88, 1)`,
  boxShadow: 'none',
}));

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const StyledHeading = styled(Typography)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.accent.w}`,
  marginRight: theme.spacing(1.5),
}));

const StyledFilterButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
  marginLeft: theme.spacing(2),
}));

const StyledMenuButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.secondary.w,
}));

export { StyledAppBar, StyledToolbar, StyledHeading, StyledFilterButton, StyledMenuButton };