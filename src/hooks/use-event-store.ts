import {useAppStore} from './use-app-store';

export const useEventStore = () => useAppStore().eventStore;
