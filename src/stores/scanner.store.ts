import {UnsubscribeEngagementHandler} from '@cere/sdk-js/dist/src/clients/engagement';
import {makeAutoObservable, reaction} from 'mobx';

// @ts-ignore
import {UserStore} from './user.store';
import {SdkTriggerEnum} from '../enums/sdk-trigger.enum';
import {ScannerStatusEnum} from '../enums/scanner-status.enum';
import {NotificationStore} from './notification.store';

export class ScannerStore {
  private _eventSubscription: UnsubscribeEngagementHandler | undefined;
  private _scanResult: Record<string, any> | undefined;
  private _status: ScannerStatusEnum = ScannerStatusEnum.INIT;
  private _errorMessage: string | undefined = undefined;
  constructor(
    private notificationStore: NotificationStore,
    private userStore: UserStore,
  ) {
    makeAutoObservable(this);
    reaction(
      () => !this.userStore.sdkInstance,
      () => {
        this._eventSubscription?.(); // unsubscribe
      },
    );
    reaction(
      () => !!this.userStore.sdkInstance,
      () => {
        this._eventSubscription?.(); // unsubscribe

        this._eventSubscription = this.userStore.sdkInstance?.onEngagement((htmlTemplate) => {
          try {
            const jsonData = htmlTemplate.replace(/(<([^>]+)>)/gi, '');
            const response: Record<string, any> = JSON.parse(jsonData);
            console.log('event response', response);
            if (response.trigger === SdkTriggerEnum.TICKET_CHECK) {
              if (response?.data?.result === true) {
                this._status = ScannerStatusEnum.SUCCESS;
              } else if (response?.data?.result === false) {
                this._throwError(response?.data?.errorMessage);
              } else {
                this._throwError('Wrong response structure in RXB response');
                console.error(response);
              }
            }
            if (response.trigger === SdkTriggerEnum.TICKET_USE) {
              if (response?.data?.result === true) {
                this.ready();
              } else if (response?.data?.result === false) {
                this._throwError(response?.data?.errorMessage);
              } else {
                this._throwError('Wrong response structure in RXB response');
                console.error(response);
              }
            }
          } catch (e) {
            console.error("Cannot parse response from sdk, it's not a JSON format");
          }
        }, {});
      },
    );
  }

  public scan(eventId: string | undefined, data: Record<string, any>): void {
    if (!eventId || data?.eventId !== eventId) {
      this._throwError('Different event');
      return;
    }

    const trigger = SdkTriggerEnum.TICKET_CHECK;
    this.userStore.sdkInstance?.sendEvent(trigger, {...data, trigger});
    this._status = ScannerStatusEnum.PROCESSING;
    this._scanResult = data;
  }
  public get status(): ScannerStatusEnum {
    return this._status;
  }

  public ready(): void {
    this._status = ScannerStatusEnum.READY;
    this._scanResult = undefined;
    this._errorMessage = undefined;
  }

  public useTicket(): void {
    if (this._status === ScannerStatusEnum.SUCCESS) {
      const trigger = SdkTriggerEnum.TICKET_USE;
      this.userStore.sdkInstance?.sendEvent(trigger, {...this._scanResult, trigger});
      this._status = ScannerStatusEnum.USE_TICKET_PROCESSING;
    }
  }

  public get errorMessage(): string | undefined {
    return this._errorMessage;
  }

  private _throwError(errorMessage: string) {
    this._status = ScannerStatusEnum.ERROR;
    this._errorMessage = errorMessage;
  }
}
