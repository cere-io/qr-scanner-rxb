import {RouterProvider, createBrowserRouter} from 'react-router-dom';

import {LoginPage} from './pages/login.page';
import {AuthorizedPageWrapper} from './wrappers/authorized-page.wrapper';
import {UnauthorizedPageWrapper} from './wrappers/unauthorized-page.wrapper';
import {VerifyPage} from './pages/verify.page';
import {EventsPage} from './pages/events.page';
import {EventScannerPage} from './pages/event-scanner.page';

const router = createBrowserRouter([
  {
    path: '/login',
    Component: UnauthorizedPageWrapper,
    children: [
      {
        path: 'verify',
        Component: VerifyPage,
      },
      {
        path: '',
        Component: LoginPage,
      },
    ],
  },
  {
    path: '/',
    Component: AuthorizedPageWrapper,
    children: [
      {
        path: 'events',
        Component: EventsPage,
      },
      {
        path: 'event-scanner/:eventId',
        Component: EventScannerPage,
      },
    ],
  },
]);

export const getRoutes = () => router.routes;
export const AppRouter = () => <RouterProvider router={router} />;
