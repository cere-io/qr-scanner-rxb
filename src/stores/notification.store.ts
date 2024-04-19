import {makeAutoObservable, reaction} from 'mobx';

interface NotificationItem {
  id: number;
  message: string;
  type: 'default' | 'error' | 'success' | 'warning' | 'info';
}

export class NotificationStore {
  private _queue: NotificationItem[] = [];

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this._queue.length,
      async () => {
        console.log(this._queue);
      },
    );
  }

  public send({
    message,
    type = 'default',
  }: {
    message: string;
    type: 'default' | 'error' | 'success' | 'warning' | 'info';
  }): void {
    const id = new Date().getTime();
    this._queue.push({
      message,
      type: type,
      id,
    });
  }

  public get length() {
    return this._queue.length;
  }

  public next(): NotificationItem | undefined {
    return this._queue.pop();
  }
}
