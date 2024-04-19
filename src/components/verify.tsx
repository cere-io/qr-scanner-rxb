import {Alert, Button, Typography} from '@mui/material';
import React, {useEffect} from 'react';
import * as yup from 'yup';
import OtpInput from 'react-otp-input';
import {SubmitHandler, useForm, useWatch} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {observer} from 'mobx-react-lite';
import {useUserStore} from '../hooks/use-user-store';
import {useLocation, useNavigate} from 'react-router-dom';
import {useSnackbar} from 'notistack';

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
  }, [setFocus]);

  const onSubmit: SubmitHandler<Record<string, any>> = async ({code}) => {
    try {
      await userStore.login({email: userStore.email!, code});
      navigate({...location, pathname: '/events'});
    } catch (e) {
      enqueueSnackbar('Wrong Otp code', {variant: 'error'});
    }
  };

  const onSendOtpCode = async () => {
    await userStore.sendOtpCode({email: userStore.email!});
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
      <Button size="large" variant="text" onClick={onSendOtpCode}>
        Resend Code
      </Button>
    </form>
  );
});
