import axios from 'axios';

import {API_RXB_ELASTIC_S2S, API_RXB_ELASTIC_URL} from '../environment';
import * as util from "util";

const api = axios.create({
  baseURL: API_RXB_ELASTIC_URL,
  headers: {
    Authorization: `Basic ${API_RXB_ELASTIC_S2S}`,
  },
});

export class RxbElasticApiService {
  public async search(
    eventType: string,
    payload: Record<string, string>,
  ): Promise<any> {
    const queryFilter: {match: {[key: string]: string}}[] = [];
    Object.keys(payload).forEach((key: string) => {
      const keyValue: string | undefined = payload[key];
      if (keyValue) {
        queryFilter.push({
          match: {
            [`payload.${key}`]: keyValue,
          },
        });
      }
    });
    const fullQuery = {
      size: 1000,
      query: {
        bool: {
          filter: [
            ...queryFilter,
            {
              match: {
                event_type: eventType,
              },
            },
          ],
        },
      },
    }
    // console.log('fullQuery', util.inspect(fullQuery, false, null, true /* enable colors */));
    let result = null;
    try {

      result = await api.post('/davinci_nft_events/_search', fullQuery);
      return result.data?.hits?.total?.value;
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  }
}
