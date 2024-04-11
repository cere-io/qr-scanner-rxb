import {RouterProvider, createBrowserRouter} from 'react-router-dom';

import {LoginPage} from './pages/login.page';

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        path: 'login',
        Component: LoginPage,
      },
    ],
  },
]);

export const getRoutes = () => router.routes;
export const AppRouter = () => <RouterProvider router={router} />;
