import {BffApiService} from '../api/bff-api.service';
import {IdentityApiService} from '../api/identity-api.service';
import {FreeportApiService, IFreeportOwnedNft} from '../api/freeport-api.service';
import {RxbElasticApiService} from '../api/rxb-elastic-api.service';

const freeportService = new FreeportApiService();
const bffService = new BffApiService();
const identityService = new IdentityApiService();
const rxbElasticApiService = new RxbElasticApiService();

const walletList: string[] = [
  // '0x61af9B220E67D9f8C69fcA4adF93e2aAddc7fa70',
  '0x0152cd9c2fc6957a8673cc86592774128aa8f392',
];

const nftSync = async (wallet: string, nft: IFreeportOwnedNft): Promise<any> => {
  const [marketplaceToCount, fiatToCount, marketplaceFromCount, fiatFromCount] = await Promise.all([
    rxbElasticApiService.search('BLOCKCHAIN_MARKETPLACE_TRANSFER_SINGLE', {
      tenant: nft.collection.tenant,
      collectionAddress: nft.collection.address,
      nftId: nft.nftId,
      to: wallet,
    }),
    rxbElasticApiService.search('BLOCKCHAIN_FIAT_TRANSFER_SINGLE', {
      tenant: nft.collection.tenant,
      collectionAddress: nft.collection.address,
      nftId: nft.nftId,
      to: wallet,
    }),
    rxbElasticApiService.search('BLOCKCHAIN_MARKETPLACE_TRANSFER_SINGLE', {
      tenant: nft.collection.tenant,
      collectionAddress: nft.collection.address,
      nftId: nft.nftId,
      from: wallet,
    }),
    rxbElasticApiService.search('BLOCKCHAIN_FIAT_TRANSFER_SINGLE', {
      tenant: nft.collection.tenant,
      collectionAddress: nft.collection.address,
      nftId: nft.nftId,
      from: wallet,
    })
  ]);
  return {
    marketplaceToCount,
    fiatToCount,
    marketplaceFromCount, fiatFromCount
  };
};

const walletSync = async (wallet: string) => {
  const walletNfts = await freeportService.getOwnerNfts(wallet);
  // const rxbBoughtFiatCountNfts = walletNfts.map((nft) => nftSync(wallet, nft));
  for(let i = 0; i < walletNfts.length; i++) {
    const walletNft = walletNfts[i];
    const result = await nftSync(wallet, walletNft);
    console.log(walletNft.collection.tenant, wallet, walletNft.collection.address, walletNft.nftId, walletNft.balance, result);
  }


};

const start = async () => {
  walletList.forEach((wallet: string) => walletSync(wallet));
};

start();
