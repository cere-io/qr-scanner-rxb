import {makeAutoObservable} from 'mobx';
import {APP_ID} from '../environment';

// @ts-ignore
import * as web from '@cere/sdk-js/dist/web';
import {AuthApiService} from '../api/auth-api.service';
import type {CereSDK} from '@cere/sdk-js/dist/src';
import {UnsubscribeEngagementHandler} from '@cere/sdk-js/dist/src/clients/engagement';

export class UserStore {
  private _sdkInstance: CereSDK | null = null;
  private _userEmail: string | null = null;
  private _userSdkSubscription: UnsubscribeEngagementHandler | undefined = undefined;
  public _userSdkEvents: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public login = async ({email, code}: {email: string; code?: string}) => {
    if (!code) {
      await new AuthApiService().sendOtp(email);
      return;
    }

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
      this._userSdkEvents.push(htmlTemplate);
      console.log('events', this._userSdkEvents);
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
    return !!this._userEmail;
  }

  public get sdkInstance(): CereSDK {
    if (!this._sdkInstance) {
      throw new Error('Cannot get instance of cereSDK');
    }
    return this._sdkInstance;
  }

  public get lastEvent(): string | undefined {
    // const text = '<body><b>some text</b></body>';
    // return text;
    return this._userSdkEvents[this._userSdkEvents.length - 1];
  }
}
