import React from 'react';
import {Typography} from '@mui/material';
import {Outlet} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {ReactComponent as LogoSvg} from './../assets/logo.svg';

export const UnauthorizedWrapperPage = observer(() => {
  return (
    <div className="flex flex-col divide-y max-w-[500px] m-auto">
      <header className="flex flex-row justify-between p-5">
        <div className="flex flex-row gap-3">
          <LogoSvg />
          <Typography variant="body1">DaVinci Scanner</Typography>
        </div>
      </header>
      <main className="flex flex-col">
        <Outlet />
      </main>
    </div>
  );
});
