import {createTheme} from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#5210E2',
      light: '#c4b4f1',
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
          padding: '11px',
          textTransform: 'none',
        },
      },
    },
  },
});
