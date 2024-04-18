import axios from 'axios';

import {API_BFF_URL, APP_TENANT_ID} from '../environment';
import type {ExhibitCardInterface} from '@cere/services-types';

const api = axios.create({
  baseURL: API_BFF_URL,
  headers: {
    'X-Tenant-Id': APP_TENANT_ID,
  },
});

export class BffApiService {
  public async events(): Promise<ExhibitCardInterface[]> {
    let result = null;
    try {
      result = await api.get('/exhibits/?locale=en');
    } catch (err: any) {
      console.error(err);
    }
    if (result?.status !== 200 && Array.isArray(result?.data?.data)) {
      throw new Error('Get events error');
    }
    return result?.data?.data as ExhibitCardInterface[];
  }
}
