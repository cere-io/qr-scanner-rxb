import React from 'react';
import {QrScannerComponent} from '../components/qr-scanner';
import {observer} from 'mobx-react-lite';
import {Button, CircularProgress, Tooltip, Typography} from '@mui/material';
import {useLocation, useNavigate} from 'react-router-dom';
import {ReactComponent as ArrowLeft} from './../assets/arrow-left.svg';
import {ReactComponent as CheckIcon} from './../assets/check.svg';
import {ReactComponent as QrIcon} from './../assets/qr-code.svg';
import {ReactComponent as CloseIcon} from './../assets/close.svg';
import {useScannerStore} from '../hooks/use-scanner-store';
import {ScannerStatusEnum} from '../enums/scanner-status.enum';

export const EventScannerPage = observer(() => {
  const scannerStore = useScannerStore();
  const location = useLocation();
  const navigate = useNavigate();

  const onQRCodeScan = async (result: Record<string, any>) => {
    console.log('onQRCodeScan result', result);
    // const collectionId = result?.collectionId;
    // const nftId = result?.nftId;
    // const wallet = result?.wallet;
    // // userWallet = result?.
    // const userNfts = await new FreeportApiService().getOwnerNfts(wallet);
    // const balance = userNfts.find((nft) => nft.collection.address === collectionId && nft.nftId === nftId)?.balance || '0'
    // console.log('balance', balance);
    scannerStore.scan(result);
  };

  const emulateScan = () => {
    // FIXME remove this code
    onQRCodeScan({
      nftId: '4',
      collectionId: '0x580711df26c49c4718e8bbef73c4306cadfef6ae',
      wallet: '0x61af9b220e67d9f8c69fca4adf93e2aaddc7fa70',
      timestamp: 1713404107964,
      eventId: '31',
      signature:
        '0x81204556dec77a76a4ebde4cf5c636957c611952f7f3bf418f64f7c1acbdda3a61416d4356566489791fcd5e38b8d06e1aa7cf8e65c1d865ebf6e9b40cf6280a1c',
    });
    // onQRCodeScan({
    //   nftId: '4',
    //   collectionId: '0xd1A5b1a915875d46b2dC02994B7CC0ffD1d24882',
    //   wallet: '0x61af9b220e67d9f8c69fca4adf93e2aaddc7fa70',
    //   timestamp: 1712925658605,
    //   eventId: '29',
    //   signature:
    //     '0x764840c88258b90196317c5cd8ff6c49e64ad20e36345b11897f5f8b6b2ec84e7ff3ecbc04ec80ef219c005aed58b54d8eb7c145c7dcbbff770ec922559e84191b',
    // })
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

      <Button onClick={emulateScan}>Emulate scan</Button>
    </div>
  );
});
