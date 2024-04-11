import {RouterProvider, createBrowserRouter} from 'react-router-dom';

import {LoginPage} from './pages/login.page';
import {QrScannerPage} from './pages/qr-scanner.page';
import {WrapperPage} from './pages/wrapper.page';
import {EventIframePage} from './pages/event-iframe.page';

const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/event-iframe',
    Component: EventIframePage,
  },
  {
    path: '/',
    Component: WrapperPage,
    children: [
      {
        path: 'scanner',
        Component: QrScannerPage,
      },
    ],
  },
]);

export const getRoutes = () => router.routes;
export const AppRouter = () => <RouterProvider router={router} />;
