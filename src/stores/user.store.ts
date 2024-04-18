import type {CereSDK} from '@cere/sdk-js/dist/src';
import {UnsubscribeEngagementHandler} from '@cere/sdk-js/dist/src/clients/engagement';
// @ts-ignore
import * as web from '@cere/sdk-js/dist/web';
import {makeAutoObservable} from 'mobx';

import {IdentityApiService} from '../api/identity-api.service';
import {APP_ID} from '../environment';

export class UserStore {
  private _sdkInstance: CereSDK | null = null;
  private _userEmail: string | null = null;
  private _userSdkSubscription: UnsubscribeEngagementHandler | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  public async sendOtpCode({email}: {email: string}) {
    this._userEmail = email;
    await new IdentityApiService().sendOtp(email);
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
}
