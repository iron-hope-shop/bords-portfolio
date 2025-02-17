import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const BackgroundContainer = styled('div')({
    backgroundImage: "url('/bg_sq_6.png')",
    backgroundRepeat: 'repeat',
    backgroundSize: '256px 256px',
    minHeight: '100vh',
    padding: '32px',
    boxSizing: 'border-box',
    position: 'fixed',
    top: 0,
    width: '100%',
    overflow: 'hidden', // Prevent the container itself from scrolling
    zIndex: -1, // Ensure it stays behind the content
});

export const ScrollableContent = styled('div')({
    position: 'relative',
    zIndex: 1, // Ensure it stays above the background
    height: '100vh',
    overflowY: 'auto', // Enable vertical scrolling
});

export const PaddingBox = styled(Box)({
    padding: 24,
    paddingBottom: '15%',
    '@media (max-width: 600px)': {
        paddingBottom: '50%',
    },
});