import {CustomContentProps, SnackbarContent, useSnackbar} from 'notistack';
import {Typography} from '@mui/material';
import {ReactComponent as CloseIcon} from '../../assets/close.svg';
import {forwardRef} from 'react';

export const NotificationInfo = forwardRef<HTMLDivElement, CustomContentProps>((props, ref) => {
  const {closeSnackbar} = useSnackbar();
  const {id, message, ...other} = props;

  return (
    <SnackbarContent ref={ref} role="alert" {...other} className="bg-violet-100 rounded-2xl flex">
      <div className="flex flex-row-reverse w-full p-3 gap-3 items-center">
        <CloseIcon className="fill-violet-600 w-7 h-7" onClick={() => closeSnackbar(id)} />
        <div className="flex flex-col w-full text-center">
          <Typography>{message}</Typography>
        </div>
        <div className="w-7 h-7">&nbsp;</div>
      </div>
    </SnackbarContent>
  );
});
