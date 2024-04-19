import packageJson from '../package.json';
import {AppRouter} from './router';
import {theme} from './theme';
import {ThemeProvider} from '@mui/material';
import {SnackbarProvider} from 'notistack';
import {NotificationWrapper} from './components/notification-wrapper';

export function App() {
  console.log(
    `%cClient App Version:  ${packageJson.version}`,
    ` color:white; background-color:black; border-left: 1px solid yellow; padding: 4px;`,
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <AppRouter />
          <NotificationWrapper />
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}
