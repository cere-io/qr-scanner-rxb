import React from 'react';
import {Typography} from '@mui/material';
import {ReactComponent as ArrowLeft} from './../assets/arrow-left.svg';
import {useLocation, useNavigate} from 'react-router-dom';
import {useEventStore} from '../hooks/use-event-store';
import {observer} from 'mobx-react-lite';

export const EventsPage = observer(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const eventStore = useEventStore();

  const toScannerPage = (eventId: string) => {
    navigate({...location, pathname: `/event-scanner/${eventId}`});
  };

  return (
    <div className="flex flex-col p-5 gap-3">
      <div className="flex flex-col items-center">
        <Typography variant="h5">Choose The Event</Typography>
        <Typography variant="body1" color="gray">
          All upcoming events you have access to
        </Typography>
      </div>
      <div className="flex flex-col gap-2">
        {eventStore.events.map((eventData, index) => (
          <div
            key={`event-${index}`}
            className="p-4 flex flex-row justify-between items-center bg-white rounded-2xl border border-gray-200"
          >
            <div className="flex flex-row gap-2 items-start">
              <img
                srcSet={`${eventData.image.formats?.small?.url} ${eventData.image.formats?.small?.width}w`}
                sizes={`(max-width: 320px) ${eventData.image.formats?.small?.width}px`}
                className="w-8 h-8 min-w-8 object-cover"
                src={eventData.image.url}
                alt={eventData.image.alternativeText}
              />
              <div className="flex flex-col">
                <Typography variant="body1">
                  {eventData.creator.name} {eventData.title}
                </Typography>
                <Typography variant="body2">{new Date().toISOString()}</Typography>
              </div>
            </div>
            <div className="cursor-pointer" onClick={() => toScannerPage(String(eventData.id))}>
              <ArrowLeft className="w-6 rotate-180" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});