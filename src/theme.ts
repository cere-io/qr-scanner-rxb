import {createTheme} from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#5210E2',
      light: '#c4b4f1',
    },
  },
  typography: {
    fontFamily: 'HumanSans, Inter, Roboto, Helvetica, Arial, sans-serif',
    h5: {
      fontWeight: 500,
      fontSize: '24px',
    },
    h6: {
      fontWeight: 500,
      fontSize: '20px',
    },
    body1: {
      fontWeight: 400,
      fontSize: '16px',
    },
    body2: {
      fontWeight: 400,
      fontSize: '12px',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          fieldset: {
            borderRadius: '12px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        sizeLarge: {
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: 500,
          padding: '11px 30px 11px 30px',
          textTransform: 'none',
        },
      },
    },
  },
});
