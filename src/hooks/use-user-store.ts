import {useAppStore} from './use-app-store';

export const useUserStore = () => useAppStore().userStore;
