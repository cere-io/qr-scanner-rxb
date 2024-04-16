import React from 'react';
import {Tooltip, Typography} from '@mui/material';
import {ReactComponent as ArrowLeft} from './../assets/arrow-left.svg';
import {VerifyComponent} from '../components/verify';
import {useLocation, useNavigate} from 'react-router-dom';
import {useUserStore} from '../hooks/use-user-store';

export const VerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userStore = useUserStore();
  const backHandler = () => {
    navigate({...location, pathname: '/login'});
  };

  return (
    <div className="flex flex-col p-5 gap-4">
      <div className="flex flex-col">
        <div className="flex flex-row justify-between items-center gap-4">
          <Tooltip title="Return back to the welcom page">
            <div className="cursor-pointer" onClick={() => backHandler()}>
              <ArrowLeft className="w-6" />
            </div>
          </Tooltip>
          <Typography variant="h5">Verify Your Address</Typography>
          <span className="w-6">&nbsp;</span>
        </div>
        <div className="flex flex-col text-center">
          <Typography variant="body2" color="gray">
            {`A verification code has been sent to your email address: ${userStore.email}`}
          </Typography>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <VerifyComponent />
      </div>
    </div>
  );
};
