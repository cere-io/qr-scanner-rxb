import React from 'react';
import {Link, Typography} from '@mui/material';
import {Outlet, Link as RouterLink, useNavigate} from 'react-router-dom';
import {useUserStore} from '../hooks/use-user-store';
import {observer} from 'mobx-react-lite';

export const WrapperPage = observer(() => {
  const userStore = useUserStore();
  const navigate = useNavigate();
  const logout = () => {
    console.log('logout');
    userStore.logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col">
      <header className="flex flex-row bg-violet-300 justify-between p-4">
        <Typography variant="body1">the header here is waiting the design team</Typography>
        <ul className="flex flex-row gap-5">
          <li>
            <Link component={RouterLink} to="/">
              Home
            </Link>
          </li>
          <li>
            <Link component={RouterLink} to="/scanner">
              Scanner
            </Link>
          </li>
          <li>
            <Link component={RouterLink} to="/event-iframe">
              Event iframe
            </Link>
          </li>
          <li>
            <Link href="#" onClick={() => logout()}>
              Sign out
            </Link>
          </li>
        </ul>
      </header>
      <main className="flex flex-col">
        <Outlet />
      </main>
      <footer className="flex flex-col bg-violet-400 p-4">the footer here is waiting the design team</footer>
    </div>
  );
});
