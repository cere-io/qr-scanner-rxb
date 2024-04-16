import {EventStore} from './event.store';
import {UserStore} from './user.store';

export class AppStore {
  readonly userStore: UserStore;
  readonly eventStore: EventStore;

  constructor() {
    this.userStore = new UserStore();
    this.eventStore = new EventStore(this.userStore);
  }
}
