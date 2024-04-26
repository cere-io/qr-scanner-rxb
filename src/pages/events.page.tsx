import React from 'react';
import {Button, CircularProgress, Typography} from '@mui/material';
import {ReactComponent as ArrowLeft} from './../assets/arrow-left.svg';
import {useLocation, useNavigate} from 'react-router-dom';
import {useEventStore} from '../hooks/use-event-store';
import {observer} from 'mobx-react-lite';
import {useUserStore} from '../hooks/use-user-store';
import dayjs from 'dayjs';
import {enumToTextHelper} from '../helpers/enum-to-text.helper';
import {capitalizeFirstLetterHelper} from '../helpers/capitalize-first-letter.helper';

export const EventsPage = observer(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const eventStore = useEventStore();
  const userStore = useUserStore();

  const toScannerPage = (eventId: string) => {
    navigate({...location, pathname: `/event-scanner/${eventId}`});
  };

  return (
    <div className="flex flex-col p-5 gap-3">
      {eventStore.events === null && (
        <div className="flex flex-col items-center justify-center h-[500px]">
          <CircularProgress color="primary" />
        </div>
      )}
      {eventStore.events?.length === 0 && (
        <>
          <img
            srcSet="/images/size/list-320x320.jpeg 320w"
            sizes="(max-width: 320px) 280px"
            src="/images/original/list.jpeg"
            alt=""
          />
          <div className="flex flex-col items-center">
            <Typography variant="h5">No upcoming events found</Typography>
            <Typography variant="body1" color="gray">
              Try later or change the account
            </Typography>
          </div>
          <Button color="primary" size="large" variant="contained" onClick={() => eventStore.reload()}>
            Refresh
          </Button>
          <Button color="primary" size="large" variant="text" onClick={() => userStore.logout()}>
            Logout
          </Button>
        </>
      )}
      {!!eventStore.events?.length && (
        <>
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
                    className="w-8 h-8 min-w-8 object-cover rounded mt-1"
                    src={eventData.image.url}
                    alt={eventData.image.alternativeText}
                  />
                  <div className="flex flex-col">
                    <Typography variant="body1">
                      {capitalizeFirstLetterHelper(enumToTextHelper(eventData.eventType))} event with{' '}
                      {eventData.creator.name} - {eventData.title}
                    </Typography>
                    {eventData?.startsAt && (
                      <Typography variant="body2" color="gray">
                        {dayjs(eventData.startsAt).format('DD MMMM YYYY, HH:mm')}
                      </Typography>
                    )}
                  </div>
                </div>
                <div className="cursor-pointer" onClick={() => toScannerPage(String(eventData.id))}>
                  <ArrowLeft className="w-6 rotate-180" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
});
