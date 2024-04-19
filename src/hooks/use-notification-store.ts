import {useAppStore} from './use-app-store';

export const useNotificationStore = () => useAppStore().notificationStore;
