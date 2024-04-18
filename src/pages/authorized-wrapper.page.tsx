import React, {useEffect, useState} from 'react';
import {Tooltip, Typography} from '@mui/material';
import {Outlet, useNavigate} from 'react-router-dom';
import {useUserStore} from '../hooks/use-user-store';
import {observer} from 'mobx-react-lite';
import {ReactComponent as LogoSvg} from './../assets/logo.svg';
import {ConfirmLogoutDialog} from '../components/dialogs/confirm-logout.dialog';
import {ExitIcon} from '../components/icon/exit-icon';

export const AuthorizedWrapperPage = observer(() => {
  const userStore = useUserStore();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const logout = () => {
    userStore.logout();
    navigate('/login');
  };

  useEffect(() => {
    if (!userStore.isAuth) {
      logout();
    }
  }, [userStore.isAuth, logout]);

  return (
    <div className="flex flex-col divide-y max-w-[500px] m-auto">
      <header className="flex flex-row justify-between p-5">
        <div className="flex flex-row gap-3">
          <LogoSvg />
          <Typography variant="body1">DaVinci Scanner</Typography>
        </div>
        <ul className="flex flex-row gap-5">
          <li>
            <Tooltip title="Sign out">
              <div className="cursor-pointer" onClick={() => setShowLogoutDialog(true)}>
                <ExitIcon />
              </div>
            </Tooltip>
          </li>
        </ul>
      </header>
      <main className="flex flex-col">
        <Outlet />
      </main>
      <ConfirmLogoutDialog open={showLogoutDialog} onClose={() => setShowLogoutDialog(false)} onLogout={logout} />
    </div>
  );
});
