import type {CereSDK} from '@cere/sdk-js/dist/src';
import {UnsubscribeEngagementHandler} from '@cere/sdk-js/dist/src/clients/engagement';
// @ts-ignore
import * as web from '@cere/sdk-js/dist/web';
import {makeAutoObservable} from 'mobx';

import {AuthApiService} from '../api/auth-api.service';
import {SdkTriggerEnum} from '../enums/sdk-trigger.enum';
import {APP_ID} from '../environment';

export class UserStore {
  private _sdkInstance: CereSDK | null = null;
  private _userEmail: string | null = null;
  private _userSdkSubscription: UnsubscribeEngagementHandler | undefined = undefined;
  private _otpCodeSendTime: null | Date = null;
  private _userSdkEvents: Record<string, any>[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public async sendOtpCode({email}: {email: string}) {
    this._userEmail = email;
    await new AuthApiService().sendOtp(email);
    this._otpCodeSendTime = new Date();
  }

  public login = async ({email, code}: {email: string; code: string}) => {
    try {
      this._sdkInstance = web.cereWebSDK(APP_ID, undefined, {
        authMethod: {
          type: 'EMAIL',
          email: email,
          password: code,
        },
        deployment: 'dev',
      });
      this._userEmail = email;
    } catch (e: any) {
      console.error(e);
      throw new Error(e);
    }
    console.log('sdkInstance', this._sdkInstance);

    this._userSdkSubscription = this._sdkInstance?.onEngagement((htmlTemplate) => {
      try {
        const jsonData = htmlTemplate.replace(/(<([^>]+)>)/gi, '');
        const data = JSON.parse(jsonData);
        console.log('Event data from SDK', data);

        if (data.trigger === SdkTriggerEnum.DAVINCI_QR_CODE_VALIDATOR) {
          this._userSdkEvents.push(data);
        }
      } catch (e) {
        console.error("Cannot parse response from sdk, it's not a JSON format");
      }
    }, {});
  };

  public logout() {
    this._userSdkSubscription?.();
    this._userEmail = null;
    this._sdkInstance = null;
  }

  public get email() {
    return this._userEmail;
  }

  public get isAuth() {
    return !!this._userEmail && !!this._sdkInstance;
  }

  public get sdkInstance(): CereSDK {
    if (!this._sdkInstance) {
      throw new Error('Cannot get instance of cereSDK');
    }
    return this._sdkInstance;
  }

  public get lastEvent(): Record<string, any> | undefined {
    // const text = '<body><b>some text</b></body>';
    // return text;
    return this._userSdkEvents[this._userSdkEvents.length - 1];
  }
}
