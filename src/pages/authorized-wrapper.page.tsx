import React, {useEffect} from 'react';
import {Link, Tooltip, Typography} from '@mui/material';
import {Outlet, Link as RouterLink, useNavigate} from 'react-router-dom';
import {useUserStore} from '../hooks/use-user-store';
import {observer} from 'mobx-react-lite';
import {ReactComponent as LogoSvg} from './../assets/logo.svg';
import {ReactComponent as ExitSvg} from './../assets/exit.svg';

export const AuthorizedWrapperPage = observer(() => {
  const userStore = useUserStore();
  const navigate = useNavigate();
  const logout = () => {
    userStore.logout();
    navigate('/login');
  };

  const auth = async () => {
    // remove
    await userStore.sendOtpCode({email: 'aleksei.s@cere.io'});
    await userStore.login({email: 'aleksei.s@cere.io', code: '555555'});
  };

  useEffect(() => {
    if (!userStore.isAuth) {
      auth(); // FIXME only for fast debuggin
      // logout();
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
            <Link component={RouterLink} to="/events">
              Events
            </Link>
          </li>
          <li>
            <Link component={RouterLink} to="/scanner">
              Scanner
            </Link>
          </li>
          <li>
            <Tooltip title="Sign out">
              <div className="cursor-pointer" onClick={() => logout()}>
                <ExitSvg />
              </div>
            </Tooltip>
          </li>
        </ul>
      </header>
      <main className="flex flex-col">
        <Outlet />
      </main>
    </div>
  );
});
