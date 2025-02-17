import { useState } from 'react';
import { ListItemIcon, ListItemText } from '@mui/material';
import { Menu, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  StyledDrawer,
  StyledDrawerHeader,
  StyledCloseButton,
  StyledList,
  StyledListItem,
  StyledMenuButton,
  StyledHomeIcon,
  StyledFavoriteIcon,
  StyledSettingsIcon,
  StyledBiotechIcon,
  StyledInfoIcon,
  StyledGithubIcon
} from './MenuDrawer.styles';

function MenuDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  const menuItems = [
    { text: 'Home', icon: <StyledHomeIcon />, path: '/' },
    { text: 'About', icon: <StyledInfoIcon />, path: '/about' },
    // { text: 'Favorites', icon: <StyledFavoriteIcon />, path: '/favorites' },
    // { text: 'Settings', icon: <StyledSettingsIcon />, path: '/settings' },
    { text: 'ORD Homepage', icon: <StyledBiotechIcon />, href: 'https://open-reaction-database.org' },
    { text: 'ORD Github', icon: <StyledGithubIcon />, href: 'https://github.com/open-reaction-database' },
    // { text: 'GitHub', icon: <StyledInfoIcon />, href: 'https://github.com/open-reaction-database' },
  ];

  const handleItemClick = (item) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.href) {
      window.open(item.href, '_blank');
    }
    setIsOpen(false);
  };

  return (
    <>
      <StyledMenuButton
        edge="end"
        aria-label="menu"
        onClick={toggleDrawer(true)}
      >
        <Menu />
      </StyledMenuButton>
      <StyledDrawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer(false)}
      >
        <StyledDrawerHeader>
          <StyledCloseButton onClick={toggleDrawer(false)}>
            <Close />
          </StyledCloseButton>
        </StyledDrawerHeader>
        <StyledList>
          {menuItems.map((item) => (
            <StyledListItem 
              button 
              key={item.text} 
              onClick={() => handleItemClick(item)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </StyledListItem>
          ))}
        </StyledList>
      </StyledDrawer>
    </>
  );
}

export default MenuDrawer;