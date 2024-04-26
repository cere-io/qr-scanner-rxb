import {Button, TextField} from '@mui/material';
import React from 'react';
import * as yup from 'yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {observer} from 'mobx-react-lite';
import {useUserStore} from '../hooks/use-user-store';
import {useLocation, useNavigate} from 'react-router-dom';

const validationSchema = yup
  .object({
    email: yup.string().email().required(),
  })
  .required();

export const LoginComponent = observer(() => {
  const userStore = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: userStore.email || '',
    },
  });

  const onSubmit: SubmitHandler<Record<string, any>> = async ({email}) => {
    await userStore.sendOtpCode({email});
    navigate({...location, pathname: '/login/verify'});
  };

  return (
    <form className="flex flex-col gap-4" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('email')}
        error={!!errors?.['email']?.message}
        helperText={errors['email']?.message}
        required
        label="Email"
        name="email"
        placeholder="Your email, for example qr-code-scanne@cere.io"
      />

      <Button type="submit" color="primary" size="large" variant="contained">
        Continue
      </Button>
    </form>
  );
});
