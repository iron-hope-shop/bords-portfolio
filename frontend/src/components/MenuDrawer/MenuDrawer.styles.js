// MenuDrawer.styles.js
import { styled } from '@mui/material/styles';
import { Drawer, Box, IconButton, List, ListItem } from '@mui/material';
import { Home, Favorite, Settings, InfoRounded, GitHub, Biotech } from '@mui/icons-material';

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 250,
    backgroundColor: theme.palette.background.default,
    borderLeft: `1px solid ${theme.palette.accent.main}`,
  },
}));

export const StyledDrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: theme.spacing(1),
  // paddingTop: 12,
  // paddingRight: 27,
}));

export const StyledCloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.secondary.w,
}));

export const StyledList = styled(List)({
    // color: theme.palette.secondary.w,
});

export const StyledHomeIcon = styled(Home)(({ theme }) => ({
  color: theme.palette.secondary.w,
}));

export const StyledFavoriteIcon = styled(Favorite)(({ theme }) => ({
  color: theme.palette.secondary.w,
}));

export const StyledSettingsIcon = styled(Settings)(({ theme }) => ({
  color: theme.palette.secondary.w,
}));

export const StyledInfoIcon = styled(InfoRounded)(({ theme }) => ({
  color: theme.palette.secondary.w,
}));

export const StyledGithubIcon = styled(GitHub)(({ theme }) => ({
  color: theme.palette.secondary.w,
}));

export const StyledBiotechIcon = styled(Biotech)(({ theme }) => ({
  color: theme.palette.secondary.w,
}));

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  color: theme.palette.secondary.w,
    '&:hover': {
    backgroundColor: theme.palette.accent.main,
  },
}));

export const StyledMenuButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.secondary.w,
}));