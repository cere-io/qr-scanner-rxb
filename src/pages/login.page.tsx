import {Button, TextField, Typography} from '@mui/material';
import React from 'react';
import OtpInput from 'react-otp-input';

export const LoginPage = () => {
  const onChangeHandler = (val: any) => {
    console.log('onChangeHandler', val);
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <div className="border border-b-blue-500 p-4 rounded-2xl flex flex-col gap-4 w-full sm:w-[550px]">
        <TextField id="outlined-basic" label="Email address" variant="outlined" />
        <Button color="primary" variant="contained">
          Sign Up
        </Button>
        <Typography variant="body2">Verification code</Typography>
        <div className="flex flex-row justify-center">
          <OtpInput
            value={''}
            onChange={onChangeHandler}
            numInputs={6}
            renderSeparator={<span>&nbsp;</span>}
            renderInput={(props) => <input {...props} />}
            inputStyle={{
              width: '36px',
              height: '50px',
              borderRadius: '12px',
              border: '1px solid rgb(147 197 253)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
