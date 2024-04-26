import {Button, Typography} from '@mui/material';
import React, {useEffect, useState} from 'react';
import * as yup from 'yup';
import OtpInput from 'react-otp-input';
import {SubmitHandler, useForm, useWatch} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {observer} from 'mobx-react-lite';
import {useUserStore} from '../hooks/use-user-store';
import {useLocation, useNavigate} from 'react-router-dom';
import {useSnackbar} from 'notistack';

const RESEND_CODE_TIMEOUT = 60; // seconds

const validationSchema = yup
  .object({
    code: yup.string().required(),
  })
  .required();

export const VerifyComponent = observer(() => {
  const userStore = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  const [resendOtpTimer, setResendOtpTimer] = useState<number>(RESEND_CODE_TIMEOUT);

  const {
    control,
    handleSubmit,
    // setError,
    getValues,
    formState: {errors},
    setValue: setFormValue,
    setFocus,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'all',
    defaultValues: {
      code: '',
    },
  });

  useWatch({control, name: 'code'});

  useEffect(() => {
    setFocus('code');
    window.scrollTo(0, 0);
  }, [setFocus]);

  useEffect(() => {
    if (resendOtpTimer >= 0) {
      const timer = setTimeout(() => {
        setResendOtpTimer(resendOtpTimer - 1);
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [resendOtpTimer]);

  const onSubmit: SubmitHandler<Record<string, any>> = async ({code}) => {
    try {
      await userStore.login({email: userStore.email!, code});
      navigate({...location, pathname: '/events'});
    } catch (e) {
      enqueueSnackbar('Wrong OTP code', {variant: 'error'});
    }
  };

  const onSendOtpCode = async () => {
    if (!userStore.email) {
      navigate({...location, pathname: '/login'});
    }
    const result = await userStore.sendOtpCode({email: userStore.email!});
    if (result) {
      setResendOtpTimer(RESEND_CODE_TIMEOUT);
    }
  };

  return (
    <form className="flex flex-col gap-3" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col justify-center items-center">
        <OtpInput
          value={getValues('code')}
          onChange={(val) => setFormValue('code', val)}
          numInputs={6}
          renderSeparator={<span>&nbsp;</span>}
          renderInput={(props) => <input {...props} />}
          inputStyle={{
            width: '38px',
            height: '50px',
            borderRadius: '12px',
            border: '1px solid rgb(147 197 253)',
          }}
          shouldAutoFocus={true}
        />
        <Typography variant="body2" color="error">
          {errors?.['code']?.message}
        </Typography>
      </div>
      <Button type="submit" size="large" color="primary" variant="contained">
        Verify
      </Button>
      <Button size="large" disabled={resendOtpTimer > 0} variant="text" color="secondary" onClick={onSendOtpCode}>
        Resend Code {resendOtpTimer > 0 ? `(${resendOtpTimer}s)` : ''}
      </Button>
    </form>
  );
});
