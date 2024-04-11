import {AppStore} from '../stores/app.store';

let appStore: AppStore;

if (process.env.NODE_ENV === 'development') {
  //@ts-ignore
  window.appStore = () => appStore;
}

export const useAppStore = () => {
  if (!appStore) {
    appStore = new AppStore();
  }

  return appStore;
};
