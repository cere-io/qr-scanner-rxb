import packageJson from '../package.json';
import {AppRouter} from './router';
import {theme} from './theme';
import {ThemeProvider} from '@mui/material';
import {NotificationsWrapper} from './wrappers/notifications.wrapper';
import {SnackbarProvider} from 'notistack';
import {NotificationInfo} from './components/notification/notification-info';
import {NotificationError} from './components/notification/notification-error';

export function App() {
  console.log(
    `%cClient App Version:  ${packageJson.version}`,
    ` color:white; background-color:black; border-left: 1px solid yellow; padding: 4px;`,
  );

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider hideIconVariant={true} Components={{info: NotificationInfo, error: NotificationError}}>
        <AppRouter />
        <NotificationsWrapper />
      </SnackbarProvider>
    </ThemeProvider>
  );
}
