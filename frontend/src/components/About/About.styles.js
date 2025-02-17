import { styled } from '@mui/material/styles';
import { Box, Typography, Modal, IconButton } from '@mui/material';

export const TruncatedText = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
});

export const CardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

export const InfoBox = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  overflow: 'hidden',
  marginTop: theme.spacing(2),
}));

export const ImageContainer = styled(Box)(({ theme }) => ({
  // height: '300px',
  marginBottom: -2,
  overflow: 'hidden',
  cursor: 'pointer',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform .3s ease',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  },
  backgroundColor: theme.palette.accent.main,
}));

export const ContentContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

export const Tabs = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.palette.grey[100],
}));

export const Tab = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  flex: 1,
  padding: theme.spacing(1),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'background-color .3s',
  fontSize: '0.9em',
  color: active ? "white" : "black",
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  '&:hover': {
    color: "white",
    backgroundColor: theme.palette.accent.main,
  },
}));


export const Content = styled(Box)({
  flexGrow: 1,
  overflowY: 'auto',
  padding: '32px',
});

export const ContentPanel = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  display: active ? 'block' : 'none',
  padding: theme.spacing(2),
  whiteSpace: 'normal',
  wordWrap: 'break-word',
}));

export const Item = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}));

export const ItemHeader = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(1),
  cursor: 'pointer',
  fontWeight: 'bold',
}));

export const ItemContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ active }) => ({
  maxHeight: active ? '200px' : '0',
  overflowY: active ? 'auto' : 'hidden',
  transition: 'max-height .3s ease-out',
}));

export const ItemContentInner = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  '& p': {
    margin: `${theme.spacing(0.5)} 0`,
    wordBreak: 'break-word',
  },
}));

export const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(5px)',
  width: '100vw',
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
});

export const ModalContent = styled('img')({
  maxWidth: '80%',
  objectFit: 'contain',
  boxSizing: 'border-box',
  margin: 'auto',
  display: 'block',
});

export const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(4),
  color: theme.palette.common.white,
  fontSize: '40px',
  fontWeight: 'bold',
  transition: '.3s',
  cursor: 'pointer',
  '&:hover, &:focus': {
    color: theme.palette.grey[300],
    textDecoration: 'none',
    cursor: 'pointer',
  },
}));
