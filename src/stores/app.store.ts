import {EventStore} from './event.store';
import {UserStore} from './user.store';
import {ScannerStore} from './scanner.store';

export class AppStore {
  readonly userStore: UserStore;
  readonly eventStore: EventStore;
  readonly scannerStore: ScannerStore;

  constructor() {
    this.userStore = new UserStore();
    this.eventStore = new EventStore(this.userStore);
    this.scannerStore = new ScannerStore(this.userStore);
  }
}
