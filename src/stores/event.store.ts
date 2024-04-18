import {UnsubscribeEngagementHandler} from '@cere/sdk-js/dist/src/clients/engagement';
import {makeAutoObservable, reaction, when} from 'mobx';

// @ts-ignore
import {UserStore} from './user.store';
import {SdkTriggerEnum} from '../enums/sdk-trigger.enum';
import {BffApiService} from '../api/bff-api.service';
import {ExhibitCardInterface} from '@cere/services-types/dist/types';

export class EventStore {
  private _events: ExhibitCardInterface[] = [];
  private _eventSubscription: UnsubscribeEngagementHandler | undefined;
  private _allowedEvents: {[key: string]: string[]} = {};
  constructor(private userStore: UserStore) {
    makeAutoObservable(this);
    when(
      () => !this.userStore.sdkInstance,
      () => {
        this._eventSubscription?.(); // unsubscribe
        this._allowedEvents = {};
        this._events = [];
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
      async (value, previousValue) => {
        console.log('EventStore reaction', value, previousValue);
        const events = await new BffApiService().events();
        if (Array.isArray(events)) {
          this._events = events;
        }
      },
    );
  }

  get allowedEvents() {
    if (!this.userStore.email) {
      return [];
    }
    console.log('_allowedEvents', this._allowedEvents);
    return Object.keys(this._allowedEvents).filter((eventId) =>
      this._allowedEvents[eventId].includes(this.userStore.email!),
    );
  }

  get events() {
    return this._events.filter((event) => this.allowedEvents.includes(String(event.id)));
  }
}
