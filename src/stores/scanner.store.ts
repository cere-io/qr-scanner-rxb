import {UnsubscribeEngagementHandler} from '@cere/sdk-js/dist/src/clients/engagement';
import {makeAutoObservable, reaction} from 'mobx';

// @ts-ignore
import {UserStore} from './user.store';
import {SdkTriggerEnum} from '../enums/sdk-trigger.enum';
import {ScannerStatusEnum} from '../enums/scanner-status.enum';
import {EventStore} from './event.store';

export class ScannerStore {
  private _eventSubscription: UnsubscribeEngagementHandler | undefined;
  private _scanResult: Record<string, any> | undefined;
  private _status: ScannerStatusEnum = ScannerStatusEnum.INIT;
  private _errorMessage: string | undefined = undefined;
  private _nftForUsing: {collectionId: string; nftId: string} | undefined;
  constructor(
    private eventStore: EventStore,
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
                this._nftForUsing = {
                  collectionId: response?.data?.data?.collectionId,
                  nftId: response?.data?.data?.nftId,
                };
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

    const eventData = this.eventStore.events?.find((e) => e.id === eventId);
    // @ts-ignore
    const eventNfts = (eventData?.nfts || [])
      .filter((nft: {cmsNft?: {collection: string; nftId: string}}) => nft?.cmsNft?.collection && nft?.cmsNft?.nftId)
      .map((nft: {cmsNft: {collection: string; nftId: string}}) => ({
        collection: nft.cmsNft.collection,
        nftId: nft.cmsNft.nftId,
      }));
    const trigger = SdkTriggerEnum.TICKET_CHECK;
    this.userStore.sdkInstance?.sendEvent(trigger, {...data, trigger, eventNfts});
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
    this._nftForUsing = undefined;
  }

  public useTicket(): void {
    if (this._status === ScannerStatusEnum.SUCCESS) {
      const trigger = SdkTriggerEnum.TICKET_USE;
      this.userStore.sdkInstance?.sendEvent(trigger, {
        ...this._scanResult,
        collectionId: this._nftForUsing?.collectionId,
        nftId: this._nftForUsing?.nftId,
        trigger,
      });
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
