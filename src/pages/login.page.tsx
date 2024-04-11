import React from 'react';
import {LoginComponent} from '../components/login';

export const LoginPage = () => {
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <div className="border border-blue-300 p-6 rounded-2xl flex flex-col gap-4 w-full sm:w-[550px]">
        <LoginComponent />
      </div>
    </div>
  );
};
