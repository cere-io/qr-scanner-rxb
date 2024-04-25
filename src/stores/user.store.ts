import type {CereSDK} from '@cere/sdk-js/dist/src';
import {UnsubscribeEngagementHandler} from '@cere/sdk-js/dist/src/clients/engagement';
// @ts-ignore
import * as web from '@cere/sdk-js/dist/web';
import {makeAutoObservable} from 'mobx';

import {IdentityApiService} from '../api/identity-api.service';
import {APP_ID, RXB_SDK_ENV} from '../environment';
import {NotificationStore} from './notification.store';

export class UserStore {
  private _sdkInstance: CereSDK | null = null;
  private _userEmail: string | null = null;
  private _userSdkSubscription: UnsubscribeEngagementHandler | undefined = undefined;

  constructor(private notificationStore: NotificationStore) {
    makeAutoObservable(this);
  }

  public async sendOtpCode({email}: {email: string}) {
    if (email) {
      this._userEmail = email;
      try {
        await new IdentityApiService().sendOtp(email);
        this.notificationStore.send({message: 'A new email has been sent', type: 'info'});
      } catch (e) {
        this.notificationStore.send({message: 'Something was wrong, we cannot send you an email', type: 'error'});
      }
      return true;
    }
    return false;
  }

  public login = async ({email, code}: {email: string; code: string}) => {
    try {
      this._sdkInstance = web.cereWebSDK(APP_ID, undefined, {
        authMethod: {
          type: 'EMAIL',
          email: email,
          password: code,
        },
        deployment: RXB_SDK_ENV,
      });
      await this._sdkInstance?.signMessage('');
      this._userEmail = email;
    } catch (e: any) {
      this._sdkInstance = null;
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

  public get sdkInstance(): CereSDK | null {
    return this._sdkInstance || null;
  }
}
