import {UnsubscribeEngagementHandler} from '@cere/sdk-js/dist/src/clients/engagement';
import {makeAutoObservable, when} from 'mobx';

// @ts-ignore
import {UserStore} from './user.store';
import {SdkTriggerEnum} from '../enums/sdk-trigger.enum';
import {ScannerStatusEnum} from '../enums/scanner-status.enum';

export class ScannerStore {
  private _eventSubscription: UnsubscribeEngagementHandler | undefined;
  private _scanResult: any;
  private _status: ScannerStatusEnum = ScannerStatusEnum.INIT;
  private _errorMessage: string | undefined = undefined;
  constructor(private userStore: UserStore) {
    makeAutoObservable(this);
    when(
      () => !this.userStore.sdkInstance,
      () => {
        this._eventSubscription?.(); // unsubscribe
      },
    );
    when(
      () => !!this.userStore.sdkInstance,
      () => {
        this._eventSubscription?.(); // unsubscribe

        this._eventSubscription = this.userStore.sdkInstance.onEngagement((htmlTemplate) => {
          try {
            const jsonData = htmlTemplate.replace(/(<([^>]+)>)/gi, '');
            const response: Record<string, any> = JSON.parse(jsonData);
            console.log('event response', response);
            if (response.trigger === SdkTriggerEnum.TICKET_CHECK) {
              if (response?.data?.result === true) {
                this._status = ScannerStatusEnum.SUCCESS;
              } else if (response?.data?.result === false) {
                this._status = ScannerStatusEnum.ERROR;
                this._errorMessage = response?.data?.errorMessage;
              } else {
                this._status = ScannerStatusEnum.ERROR;
                this._errorMessage = 'Wrong response structure in RXB response';
                console.error(response);
              }
            }
            if (response.trigger === SdkTriggerEnum.TICKET_USE) {
              // some logic here
            }
          } catch (e) {
            console.error("Cannot parse response from sdk, it's not a JSON format");
          }
        }, {});
      },
    );
  }

  public scan(data: Record<string, any>): void {
    const trigger = SdkTriggerEnum.TICKET_CHECK;
    this.userStore.sdkInstance.sendEvent(trigger, {...data, trigger});
    this._status = ScannerStatusEnum.PROCESSING;
  }
  public get status(): ScannerStatusEnum {
    return this._status;
  }

  public ready(): void {
    this._status = ScannerStatusEnum.READY;
    this._errorMessage = undefined;
  }

  public get errorMessage(): string | undefined {
    return this._errorMessage;
  }
}