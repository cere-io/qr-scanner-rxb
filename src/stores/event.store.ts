import {UnsubscribeEngagementHandler} from '@cere/sdk-js/dist/src/clients/engagement';
import {makeAutoObservable, reaction, when} from 'mobx';

// @ts-ignore
import {UserStore} from './user.store';
import {SdkTriggerEnum} from '../enums/sdk-trigger.enum';
import {BffApiService} from '../api/bff-api.service';
import {ExhibitCardInterface} from '@cere/services-types/dist/types';
import {NotificationStore} from './notification.store';

export class EventStore {
  private _events: ExhibitCardInterface[] | null = null;
  private _eventSubscription: UnsubscribeEngagementHandler | undefined;
  private _allowedEvents: {[key: string]: string[]} = {};

  constructor(
    private notificationStore: NotificationStore,
    private userStore: UserStore,
  ) {
    makeAutoObservable(this);
    when(
      () => !this.userStore.sdkInstance,
      () => {
        this._eventSubscription?.(); // unsubscribe
        this._allowedEvents = {};
        this._events = null;
      },
    );
    when(
      () => !!this.userStore.sdkInstance,
      () => {
        const trigger = SdkTriggerEnum.PERMISSIONS;
        this._eventSubscription?.(); // unsubscribe

        this._eventSubscription = this.userStore.sdkInstance.onEngagement((htmlTemplate) => {
          try {
            const jsonData = htmlTemplate.replace(/(<([^>]+)>)/gi, '');
            const data: {trigger: string; data: {permissions: {[key: string]: string[]}}} = JSON.parse(jsonData);
            if (data.trigger === trigger) {
              console.log('data.data.permissions', data.data.permissions);
              this._allowedEvents = data.data.permissions;
            }
          } catch (e) {
            console.error("Cannot parse response from sdk, it's not a JSON format");
          }
        }, {});

        this.userStore.sdkInstance.sendEvent(trigger, {trigger});
      },
    );
    reaction(
      () => this._allowedEvents,
      async () => {
        await this.reload();
      },
    );
  }

  get allowedEvents(): string[] {
    if (!this.userStore.email) {
      return [];
    }
    console.log('_allowedEvents', this._allowedEvents);
    return Object.keys(this._allowedEvents).filter((eventId) =>
      this._allowedEvents[eventId].includes(this.userStore.email!),
    );
  }

  get events(): ExhibitCardInterface[] | null {
    if (!this._events) {
      return null;
    }
    return this._events.filter((event) => this.allowedEvents.includes(String(event.id)));
  }

  public async reload(): Promise<void> {
    this._events = null;
    try {
      const events = await new BffApiService().events();
      if (Array.isArray(events)) {
        this._events = events;
      }
    } catch (e: any) {
      this._events = [];
      this.notificationStore.send({message: e.message || JSON.stringify(e), type: 'error'});
    }
  }
}
