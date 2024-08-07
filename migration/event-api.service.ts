import axios from 'axios';
import {v4 as uuid} from 'uuid';

const api = axios.create({
  baseURL: process.env.MIGRATION_API_EVENT_SERVICE_URL,
  headers: {
    Authorization: `${process.env.MIGRATION_API_EVENT_SERVICE_S2S}`,
  },
});

export class EventApiService {
  private _tenant: string;

  constructor(tenant: string) {
    this._tenant = tenant;
  }

  public async sendEvent({
    payload,
    eventType,
    accountId,
  }: {
    payload: Record<string, any>;
    eventType: string;
    accountId: string;
  }): Promise<any> {
    const id = uuid();
    const request = {
      account_id: accountId,
      app_id: process.env.REACT_APP_APP_ID,
      event_type: eventType,
      connection_id: id,
      generated: false,
      id,
      is_debug: false,
      payload: {...payload, tenant: this._tenant},
      session_id: id,
      timestamp: new Date().getTime(),
      signature: '0',
    };
    let result = null;
    try {
      result = await api.post('/event/events/s2s', request);
      // console.log('request', request, result.data);
      return result.data?.hits?.total?.value;
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  }
}
