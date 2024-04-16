import React from 'react';
import {LoginComponent} from '../components/login';
import {Typography} from '@mui/material';

export const LoginPage = () => {
  return (
    <div className="flex flex-col p-5 gap-4">
      <img
        srcSet="/images/size/qr-scanner-320x320.png 320w"
        sizes="(max-width: 320px) 280px"
        src="/images/original/qr-scanner.jpeg"
        alt="QR Scanner"
      />
      <div className="flex flex-col justify-center items-center">
        <Typography variant="h5">Welcome, Gatekeeper!</Typography>
        <Typography variant="body2">Sign up with your email to get started</Typography>
      </div>
      <div className="flex flex-col gap-4">
        <LoginComponent />
      </div>
    </div>
  );
};
