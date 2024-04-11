import React, {useEffect, useRef, useState} from 'react';
import {QrScannerComponent} from '../components/qr-scanner';
import {useUserStore} from '../hooks/use-user-store';
import {observer} from 'mobx-react-lite';

export const QrScannerPage = observer(() => {
  const userStore = useUserStore();
  const [iframeHtml, setIframeHtml] = useState<any>();

  useEffect(() => {
    console.log('lastEvent', userStore.lastEvent);
    if (userStore.lastEvent) {
      const parseHtml = new DOMParser().parseFromString(userStore.lastEvent, 'text/html').body.innerHTML;
      console.log('parseHtml', parseHtml);
      setIframeHtml(parseHtml);
    }

    // @ts-ignore
    // const doc = frameId?.current?.contentWindow?.document;
    // doc.open();
    // doc.write(userStore.lastEvent);

    // let doc = document.getElementById('contentIFrame').contentWindow.document;
    // doc.open();
    // doc.write(template);
  }, [userStore.lastEvent]);
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
    userStore.sdkInstance.sendEvent('DAVINCI_QR_CODE_VALIDATOR_ET', data);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col h-[300px] border border-red-600">
        <iframe id="contentIFrame" className="" title="Iframe title" srcDoc={iframeHtml} />
      </div>
      <div className="flex flex-col border border-green-600">
        <QrScannerComponent onScan={onQRCodeScan} />
      </div>
    </div>
  );
});
