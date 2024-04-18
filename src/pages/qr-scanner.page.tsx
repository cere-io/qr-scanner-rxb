import React, {useEffect, useRef, useState} from 'react';
import {QrScannerComponent} from '../components/qr-scanner';
import {useUserStore} from '../hooks/use-user-store';
import {observer} from 'mobx-react-lite';
import {Button} from '@mui/material';
import {SdkTriggerEnum} from '../enums/sdk-trigger.enum';

export const QrScannerPage = observer(() => {
  const userStore = useUserStore();
  const [iframeHtml, setIframeHtml] = useState<any>();

  // useEffect(() => {
  // console.log('lastEvent', userStore.lastEvent);
  // if (userStore.lastEvent) {
  // const parseHtml = new DOMParser().parseFromString(userStore.lastEvent, 'text/html').body.innerHTML;
  // console.log('parseHtml', parseHtml);
  // setIframeHtml(parseHtml);
  // }

  // @ts-ignore
  // const doc = frameId?.current?.contentWindow?.document;
  // doc.open();
  // doc.write(userStore.lastEvent);

  // let doc = document.getElementById('contentIFrame').contentWindow.document;
  // doc.open();
  // doc.write(template);
  // }, [userStore.lastEvent]);
  const onQRCodeScan = (result: Record<string, any>) => {
    console.log('About to send event DAVINCI_QR_CODE_VALIDATOR_ET', result);

    const data = {
      eventId: result.eventId,
      ...result,
      qrDataJSON: {
        signature: result.signature,
        timestamp: result.timestamp,
        userId: result.userId,
      },
    };

    // @ts-ignore
    const trigger = SdkTriggerEnum.CHECK;
    userStore.sdkInstance.sendEvent(trigger, {...data, trigger});
  };

  const emulateScan = () => {
    // FIXME remove this code
    onQRCodeScan({
      nftId: '4',
      collectionId: '0xd1A5b1a915875d46b2dC02994B7CC0ffD1d24882',
      wallet: '0x61af9b220e67d9f8c69fca4adf93e2aaddc7fa70',
      timestamp: 1712925658605,
      eventId: '29',
      signature:
        '0x764840c88258b90196317c5cd8ff6c49e64ad20e36345b11897f5f8b6b2ec84e7ff3ecbc04ec80ef219c005aed58b54d8eb7c145c7dcbbff770ec922559e84191b',
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col h-[300px] border border-red-600">
        <iframe id="contentIFrame" className="" title="Iframe title" srcDoc={iframeHtml} />
      </div>
      <Button onClick={emulateScan}>Emulate scan</Button>
      <div className="flex flex-col border border-green-600">
        <QrScannerComponent onScan={onQRCodeScan} />
      </div>
    </div>
  );
});
