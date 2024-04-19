import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useSnackbar} from 'notistack';
import {useNotificationStore} from '../hooks/use-notification-store';

export const NotificationWrapper = observer(() => {
  const {enqueueSnackbar} = useSnackbar();
  const notificationStore = useNotificationStore();

  useEffect(() => {
    if (notificationStore.length) {
      const message = notificationStore.next();
      if (message) {
        enqueueSnackbar(message?.message, {variant: message.type});
      }
    }
  }, [notificationStore.length]);

  return <></>;
});
