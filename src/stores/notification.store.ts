import {makeAutoObservable, reaction} from 'mobx';

interface NotificationItem {
  id: number;
  message: string;
  type: 'default' | 'error' | 'success' | 'warning' | 'info';
}

export class NotificationStore {
  private _queue: NotificationItem[] = [];
  private _count: number = 0;

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this._count,
      async () => {
        console.log('NotificationStore _queue>>>>', this._queue);
        console.log('NotificationStore length>>>>', this._count);
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
    this._count++;
  }

  public get length() {
    return this._count;
  }

  public next(): NotificationItem | undefined {
    return this._queue.pop();
  }
}
