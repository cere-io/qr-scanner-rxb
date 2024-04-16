import React from 'react';
import {Tooltip, Typography} from '@mui/material';
import {ReactComponent as ArrowLeft} from './../assets/arrow-left.svg';
import {VerifyComponent} from '../components/verify';
import {useLocation, useNavigate} from 'react-router-dom';
import {useUserStore} from '../hooks/use-user-store';
import {useEventStore} from '../hooks/use-event-store';
import {observer} from 'mobx-react-lite';

export const EventsPage = observer(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const userStore = useUserStore();
  const eventStore = useEventStore();

  return (
    <div className="flex flex-col p-5 gap-4">
      <Typography>Permissions</Typography>
      {Object.values(eventStore.allowedEvents)}
    </div>
  );
});
