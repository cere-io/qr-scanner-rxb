import {observer} from 'mobx-react-lite';
import {QrReader} from 'react-qr-reader';
import React from 'react';

export interface QrScannerParams {
  onScan?: (result: Record<string, any>) => void;
  className?: string;
}

export const QrScannerComponent = observer(({onScan, className}: QrScannerParams) => {
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

  return (
    <QrReader
      className={className}
      onResult={(result, error) => onResult(result, error)}
      videoContainerStyle={{
        aspectRatio: '1/1',
        objectFit: 'cover',
        borderRadius: '12px',
      }}
      constraints={{facingMode: 'environment', aspectRatio: 1 / 1}}
    />
  );
});
