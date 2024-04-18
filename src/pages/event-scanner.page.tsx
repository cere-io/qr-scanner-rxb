import React, {useEffect} from 'react';
import {QrScannerComponent} from '../components/qr-scanner';
import {observer} from 'mobx-react-lite';
import {Button, CircularProgress, Tooltip, Typography} from '@mui/material';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {ReactComponent as ArrowLeft} from './../assets/arrow-left.svg';
import {ReactComponent as CheckIcon} from './../assets/check.svg';
import {ReactComponent as QrIcon} from './../assets/qr-code.svg';
import {ReactComponent as CloseIcon} from './../assets/close.svg';
import {useScannerStore} from '../hooks/use-scanner-store';
import {ScannerStatusEnum} from '../enums/scanner-status.enum';
import {useEventStore} from '../hooks/use-event-store';

export const EventScannerPage = observer(() => {
  const scannerStore = useScannerStore();
  const eventStore = useEventStore();
  const location = useLocation();
  const navigate = useNavigate();
  const {eventId} = useParams();

  useEffect(() => {
    if (!eventId || !eventStore.allowedEvents.includes(eventId)) {
      navigate({...location, pathname: '/events'});
    }
  }, [eventId, navigate, eventStore.allowedEvents, location]);

  const onQRCodeScan = async (result: Record<string, any>) => {
    scannerStore.scan({...result, eventId: result?.eventId !== eventId ? eventId : undefined});
  };

  const backHandler = () => {
    navigate({...location, pathname: '/events'});
  };

  const completeScanHandler = () => {
    scannerStore.useTicket();
  };

  return (
    <div className="flex flex-col p-5 gap-3">
      <div className="flex flex-row justify-between items-center gap-4">
        <Tooltip title="Return back to the events page">
          <div className="cursor-pointer" onClick={() => backHandler()}>
            <ArrowLeft className="w-6" />
          </div>
        </Tooltip>
        <Typography variant="h5">QR Scanner</Typography>
        <span className="w-6">&nbsp;</span>
      </div>
      <div className="text-center">
        <Typography variant="body1">"In-person event with Joey - Requiem Unlocked"</Typography>
        <Typography variant="body1" color="gray">
          starts on 23 June 2024 at 19:00
        </Typography>
      </div>
      <div className="flex flex-col gap-5">
        {scannerStore.status === ScannerStatusEnum.INIT && (
          <div className="flex flex-col aspect-square justify-center bg-gray-200 items-center rounded-2xl border-[3px] border-white corner-only-border">
            <Button
              size="large"
              onClick={() => scannerStore.ready()}
              style={{backgroundColor: 'white'}}
              color="primary"
              variant="outlined"
            >
              Start Scanner
            </Button>
          </div>
        )}
        {scannerStore.status === ScannerStatusEnum.READY && (
          <>
            <div className="flex flex-col aspect-square justify-center items-center rounded-2xl border-[3px] border-violet-500 corner-only-border">
              <QrScannerComponent className="w-full h-full" onScan={onQRCodeScan} />
            </div>
            <div className="flex flex-row justify-between bg-violet-100 rounded-xl p-3 items-center">
              <QrIcon className="w-6" />
              <Typography variant="body1">Scanner Ready</Typography>
              <div className="w-6">&nbsp;</div>
            </div>
          </>
        )}
        {scannerStore.status === ScannerStatusEnum.PROCESSING && (
          <>
            <div className="flex flex-col aspect-square justify-center bg-violet-100 items-center rounded-2xl border-[3px] border-violet-500 corner-only-border">
              <CircularProgress color="primary" />
            </div>
            <Button variant="contained" color="primary" size="large" onClick={() => scannerStore.ready()}>
              Cancel
            </Button>
          </>
        )}
        {[ScannerStatusEnum.SUCCESS, ScannerStatusEnum.USE_TICKET_PROCESSING].includes(scannerStore.status) && (
          <>
            <div className="flex flex-col aspect-square justify-center bg-green-100 items-center rounded-2xl border-[3px] border-green-600 corner-only-border">
              <img className="w-[150px] h-[150px]" src="/images/scan-success.png" alt="" />
            </div>
            <div className="flex flex-row justify-between bg-green-100 rounded-xl p-3 items-center">
              <CheckIcon className="w-6" />
              <Typography variant="body1">Valid Ticket</Typography>
              <div className="w-6">&nbsp;</div>
            </div>
            <Button
              variant="contained"
              disabled={scannerStore.status === ScannerStatusEnum.USE_TICKET_PROCESSING}
              color="primary"
              size="large"
              onClick={() => completeScanHandler()}
            >
              {scannerStore.status === ScannerStatusEnum.USE_TICKET_PROCESSING ? (
                <CircularProgress color="primary" />
              ) : (
                'Complete Scan'
              )}
            </Button>
            <Button variant="outlined" color="primary" size="large" onClick={() => scannerStore.ready()}>
              Cancel
            </Button>
          </>
        )}
        {scannerStore.status === ScannerStatusEnum.ERROR && (
          <>
            <div className="flex flex-col aspect-square justify-center bg-red-100 items-center rounded-2xl border-[3px] border-red-500 corner-only-border">
              <img className="w-[150px] h-[150px]" src="/images/scan-error.png" alt="" />
            </div>
            <div className="flex flex-row justify-between bg-red-100 rounded-xl p-3 items-center">
              <CloseIcon className="w-6" />
              <Typography variant="body1">{scannerStore.errorMessage}</Typography>
              <div className="w-6">&nbsp;</div>
            </div>
            <Button variant="contained" color="primary" size="large" onClick={() => scannerStore.ready()}>
              Try Again
            </Button>
          </>
        )}
      </div>
    </div>
  );
});
