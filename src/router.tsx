import {RouterProvider, createBrowserRouter} from 'react-router-dom';

import {LoginPage} from './pages/login.page';
import {QrScannerPage} from './pages/qr-scanner.page';
import {AuthorizedWrapperPage} from './pages/authorized-wrapper.page';
import {UnauthorizedWrapperPage} from './pages/unauthorized-wrapper.page';
import {VerifyPage} from './pages/verify.page';
import {EventsPage} from './pages/events.page';
import {EventScannerPage} from './pages/event-scanner.page';

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
      {
        path: 'event-scanner/:eventId',
        Component: EventScannerPage,
      },
    ],
  },
]);

export const getRoutes = () => router.routes;
export const AppRouter = () => <RouterProvider router={router} />;
