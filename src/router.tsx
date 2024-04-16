import {RouterProvider, createBrowserRouter} from 'react-router-dom';

import {LoginPage} from './pages/login.page';
import {QrScannerPage} from './pages/qr-scanner.page';
import {AuthorizedWrapperPage} from './pages/authorized-wrapper.page';
import {EventIframePage} from './pages/event-iframe.page';
import {UnauthorizedWrapperPage} from './pages/unauthorized-wrapper.page';
import {VerifyPage} from './pages/verify.page';
import {EventsPage} from './pages/events.page';

const router = createBrowserRouter([
  {
    path: '/login',
    Component: UnauthorizedWrapperPage,
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
    path: '/event-iframe',
    Component: EventIframePage,
  },
  {
    path: '/',
    Component: AuthorizedWrapperPage,
    children: [
      {
        path: 'scanner',
        Component: QrScannerPage,
      },
      {
        path: 'events',
        Component: EventsPage,
      },
    ],
  },
]);

export const getRoutes = () => router.routes;
export const AppRouter = () => <RouterProvider router={router} />;
