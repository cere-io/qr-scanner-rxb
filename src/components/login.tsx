import {Button, TextField, Typography} from '@mui/material';
import React, {useState} from 'react';
import * as yup from 'yup';
import OtpInput from 'react-otp-input';
import {SubmitHandler, useForm, useWatch} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {observer} from 'mobx-react-lite';
import {useUserStore} from '../hooks/use-user-store';
import {useLocation, useNavigate} from 'react-router-dom';

const validationSchema = yup
  .object({
    email: yup.string().email().required(),
    code: yup.string(),
  })
  .required();

export const LoginComponent = observer(() => {
  const userStore = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [askCode, setAskCode] = useState(false);
  const [otpCodeProcessing, setOtpCodeProcessing] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    // setError,
    getValues,
    formState: {errors},
    setValue: setFormValue,
    getFieldState,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'all',
    defaultValues: {
      email: 'aleksei.s@cere.io', // FIXME
      code: '555555',
    },
  });

  useWatch({control, name: 'code'});

  const onSubmit: SubmitHandler<Record<string, any>> = async ({email, code}) => {
    try {
      await userStore.login({email, code});
      navigate({...location, pathname: '/'});
    } catch (e) {
      // TODO some notification here
      console.log('Cannot authorize');
    }
  };

  const onSendOtpCode = async () => {
    if (getFieldState('email').invalid) {
      return;
    }
    await userStore.login({email: getValues('email')});
    setAskCode(true);
  };

  return (
    <form className="flex flex-col gap-3" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('email')}
        error={!!errors?.['email']?.message}
        helperText={errors['email']?.message}
        required
        disabled={askCode}
        label="Email"
        name="email"
        placeholder="Your email, for example qr-code-scanne@cere.io"
      />

      {askCode && (
        <>
          <div className="flex flex-col justify-center items-center">
            <Typography variant="body2">Verification code</Typography>
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
            />
            <Typography variant="body2" color="error">
              {errors?.['code']?.message}
            </Typography>
          </div>
          <Button type="submit" color="primary" variant="contained">
            Validate
          </Button>
        </>
      )}

      {!askCode && (
        <Button color="primary" variant="contained" disabled={otpCodeProcessing} onClick={onSendOtpCode}>
          Sign Up
        </Button>
      )}
    </form>
  );
});
