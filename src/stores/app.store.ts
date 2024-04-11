import {UserStore} from './user.store';

export class AppStore {
  readonly userStore: UserStore;

  constructor() {
    this.userStore = new UserStore();
  }
}
