import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#dc2626', // Red color for primary elements
      contrastText: '#ffffff', // White text on red background
    },
    secondary: {
      main: '#991b1b', // Darker red for secondary elements
      contrastText: '#ffffff',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#dc2626',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#b91c1c',
          },
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          backgroundColor: '#dc2626',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#b91c1c',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#dc2626',
          color: '#ffffff',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#dc2626',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#dc2626',
          },
        },
      },
    },
  },
});

export default theme;