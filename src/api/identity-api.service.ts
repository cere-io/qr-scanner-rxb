import axios from 'axios';

import {API_IDENTITY_URL, APP_ID} from '../environment';

const api = axios.create({
  baseURL: API_IDENTITY_URL,
});

export class IdentityApiService {
  public async sendOtp(email: string): Promise<boolean> {
    let result = null;
    try {
      result = await api.post('/identity/auth', {appId: APP_ID, email});
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }

    return result?.status === 200;
  }

  public async fetchWallet(
    email: string,
    otp: string,
  ): Promise<{publicKey: string; privateKey: string; token: string; locale: string}> {
    let result = null;
    try {
      result = await api.post<{
        code: string;
        data: {publicKey: string; privateKey: string; token: string; locale: string};
      }>('/identity/fetch-wallet', {appId: APP_ID, type: 'EMAIL', email, password: otp});
    } catch (err: any) {
      console.error(err);
    }

    // TODO validate data structure here
    return result?.data?.data as {publicKey: string; privateKey: string; token: string; locale: string};
  }
}
