import {EventStore} from './event.store';
import {UserStore} from './user.store';
import {ScannerStore} from './scanner.store';
import {NotificationStore} from './notification.store';

export class AppStore {
  readonly notificationStore: NotificationStore;
  readonly userStore: UserStore;
  readonly eventStore: EventStore;
  readonly scannerStore: ScannerStore;

  constructor() {
    this.notificationStore = new NotificationStore();
    this.userStore = new UserStore(this.notificationStore);
    this.eventStore = new EventStore(this.notificationStore, this.userStore);
    this.scannerStore = new ScannerStore(this.eventStore, this.userStore);
  }
}
