import React from 'react';
import {useUserStore} from '../hooks/use-user-store';
import {observer} from 'mobx-react-lite';

export const EventIframePage = observer(() => {
  const userStore = useUserStore();

  if (!userStore.lastEvent) {
    return <></>;
  }
  return <div dangerouslySetInnerHTML={{__html: userStore.lastEvent}}></div>;
});
