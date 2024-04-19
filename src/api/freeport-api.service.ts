import axios from 'axios';

import {API_FREEPORT_URL, APP_TENANT_ID} from '../environment';

const api = axios.create({
  baseURL: API_FREEPORT_URL,
  headers: {
    'X-Tenant-Id': APP_TENANT_ID,
  },
});

export interface IFreeportOwnedNft {
  id: number;
  nftId: string;
  supply: string;
  collection: {
    id: number;
    address: string;
    uri: string;
    name: string;
    tenant: string;
    metadata: {
      minter: boolean;
      trusted: boolean;
    };
  };
  balance: string;
}

export class FreeportApiService {
  public async getOwnerNfts(userWallet: string): Promise<IFreeportOwnedNft[]> {
    let result = null;
    try {
      result = await api.get<IFreeportOwnedNft[]>(`/api/wallet/${userWallet}/owned`);
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }

    if (result?.status !== 200 && Array.isArray(result?.data)) {
      throw new Error('Freeport response signature is not correct');
    }

    // TODO validate data structure here
    return result?.data as IFreeportOwnedNft[];
  }
}
