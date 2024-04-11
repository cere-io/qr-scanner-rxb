import {observer} from 'mobx-react-lite';
import {QrReader} from 'react-qr-reader';
import React from 'react';

export interface QrScannerParams {
  onScan?: (result: Record<string, any>) => void;
}

export const QrScannerComponent = observer(({onScan}: QrScannerParams) => {
  const onResult = (data: any, error: any) => {
    if (data?.text) {
      try {
        const result = JSON.parse(data?.text);
        onScan?.(result);
      } catch (e) {
        console.warn('QR code data is not a JSON');
      }
    }
  };

  return <QrReader onResult={(result, error) => onResult(result, error)} constraints={{facingMode: 'dev'}} />;
});
