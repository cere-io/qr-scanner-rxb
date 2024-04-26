import {Button, Dialog, Typography} from '@mui/material';
import React from 'react';
import {ExitIcon} from '../icon/exit-icon';

interface ConfirmLogoutDialogParams {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const ConfirmLogoutDialog = ({onClose, onLogout, open}: ConfirmLogoutDialogParams) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <div className="px-5 pt-5 pb-3 flex flex-col items-center gap-3">
        <ExitIcon color="red" />
        <Typography variant="h6">Do you want to log out?</Typography>
        <Button fullWidth variant="contained" color="error" size="large" onClick={() => onLogout?.()}>
          Log Out
        </Button>
        <Button fullWidth variant="text" color="secondary" size="large" onClick={() => onClose?.()}>
          Cancel
        </Button>
      </div>
    </Dialog>
  );
};
