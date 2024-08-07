import {BffApiService} from '../src/api/bff-api.service';
import {
  FreeportApiService,
  IFreeportMintedNft,
  IFreeportOwnedNft,
  IFreeportTransfer,
} from '../src/api/freeport-api.service';
import {RxbElasticApiService} from './rxb-elastic-api.service';
import * as util from 'util';
import {EventApiService} from './event-api.service';

const CONF_TENANT = 'DAVINCI';
const CONF_UPDATE_DATA_IN_ELASTIC = true;

const freeportService = new FreeportApiService();
const bffService = new BffApiService();
const rxbElasticApiService = new RxbElasticApiService();
const eventApiService = new EventApiService(CONF_TENANT);

interface INft {
  nftId: string;
  collection: string;
}

const nftSync = async (wallet: string, nft: IFreeportOwnedNft): Promise<any> => {
  // console.log('nftSync', nft);
  const [marketplaceToCount, fiatToCount, marketplaceFromCount /*,  fiatFromCount */] = await Promise.all([
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
    // rxbElasticApiService.search('BLOCKCHAIN_FIAT_TRANSFER_SINGLE', {
    //   tenant: nft.collection.tenant,
    //   collectionAddress: nft.collection.address,
    //   nftId: nft.nftId,
    //   from: wallet,
    // }),
  ]);
  return {
    marketplaceToCount,
    fiatToCount,
    marketplaceFromCount,
    // fiatFromCount,
    count: fiatToCount + marketplaceToCount - marketplaceFromCount,
  };
};

const enrichElasticPrimaryMarketData = async (
  nft: INft,
  nftTransfers: Array<IFreeportTransfer & {isPrimaryMarket: boolean}>,
): Promise<Array<IFreeportTransfer & {isPrimaryMarket: boolean; elasticAmount: number}>> => {
  const elasticData = await Promise.all(
    nftTransfers.map((nftTransfer) =>
      rxbElasticApiService.search('BLOCKCHAIN_FIAT_TRANSFER_SINGLE', {
        tenant: CONF_TENANT,
        collectionAddress: nft.collection,
        nftId: nft.nftId,
        to: nftTransfer.buyer,
      }),
    ),
  );

  return nftTransfers.map((nftTransfer, index) => ({...nftTransfer, elasticAmount: elasticData[index]}));
};

const walletSync = async (wallet: string) => {
  const ret = new Map<string, Record<string, any>>();
  const walletNfts = await freeportService.getOwnerNfts(wallet);
  // const rxbBoughtFiatCountNfts = walletNfts.map((nft) => nftSync(wallet, nft));
  for (let i = 0; i < walletNfts.length; i++) {
    const walletNft = walletNfts[i];
    const result = await nftSync(wallet, walletNft);
    ret.set(wallet, {
      ...ret.get(wallet),
      [`${walletNft.collection.tenant}/${walletNft.collection.address}/${walletNft.nftId}`]: {
        balance: walletNft.balance,
        elastic: result,
      },
    });
  }
  console.log(util.inspect(Object.fromEntries(ret), false, null, true /* enable colors */));
};

const getWalletListByNft = async (nft: INft): Promise<string[]> => {
  const nftTransfers = await freeportService.getNftTransfers(nft.collection, nft.nftId);
  const wallets = nftTransfers
    .map((transfer) => transfer.transfers || [])
    .flat(1)
    .map((transfer) => [transfer.buyer, transfer.creator])
    .flat(1);
  return [...new Set(wallets)];
};

const getNftTransfers = async (nft: INft): Promise<Array<IFreeportTransfer & {isPrimaryMarket: boolean}>> => {
  const nftTransfers = await freeportService.getNftTransfers(nft.collection, nft.nftId);
  const transfers = nftTransfers.map((transfer) => transfer.transfers || []).flat(1);
  let creators = transfers.map((transfer) => transfer.creator).flat(1);
  creators = [...new Set(creators)];
  const creatorMintedNfts = await Promise.all(creators.map((creator) => freeportService.getMintedNfts(creator)));
  const creatorsMap = new Map<string, IFreeportMintedNft[]>();
  creators.forEach((creator, index) => {
    creatorsMap.set(creator, creatorMintedNfts[index]);
  });
  return transfers.map((transfer) => {
    const creatorOwnedNfts = creatorsMap.get(transfer.creator) || [];
    const isPrimaryMarket = !!creatorOwnedNfts.find(
      (ownedNft: IFreeportMintedNft) =>
        ownedNft.collection.address.toLowerCase() === nft.collection.toLowerCase() && ownedNft.nftId === nft.nftId,
    );
    return {...transfer, isPrimaryMarket};
  });
};

const getAllNftList = async (): Promise<INft[]> => {
  const nftList = (await bffService.events())
    // @ts-ignore
    .map((event) => event?.nfts || [])
    .flat(1)
    .map((nft) => nft.cmsNft)
    .map((nft) => ({
      collection: nft.collection,
      nftId: nft.nftId,
    }))
    .sort((a, b) => {
      if (a.collection === b.collection) {
        return +a.nftId > +b.nftId ? 1 : -1;
      } else {
        return a.collection > b.collection ? 1 : -1;
      }
    });
  return [...new Set(nftList)];
};

const start = async () => {
  // 1. extract all NFTs from all available events in Davinci
  const nftList = (await getAllNftList()).slice(-4);

  // 2. get transfers for each nfts
  for (const nft of nftList) {
    console.log(`Start ${nft.collection}/${nft.nftId}`);
    const nftTransfers = await getNftTransfers(nft);
    // console.debug('nftTransfers', nftTransfers.length)
    const nftTransfersWithAmount = nftTransfers.reduce((acc: any, val) => {
      const hasTransfer = acc.find(
        (item: IFreeportTransfer & {isPrimaryMarket: boolean}) =>
          item.buyer === val.buyer &&
          item.price === val.price &&
          item.creator === val.creator &&
          item.isPrimaryMarket === val.isPrimaryMarket,
      );
      if (hasTransfer) {
        return [...acc, {...val, amount: String(+hasTransfer.amount + +val.amount)}].filter(
          (item) => item.id !== hasTransfer.id,
        );
      } else {
        return [...acc, val];
      }
    }, []);
    // console.debug('nftTransfersWithAmount', nftTransfersWithAmount.length)
    console.log(`Primary market synchronization`);
    const nftTransfersWithElasticData = await enrichElasticPrimaryMarketData(
      nft,
      nftTransfersWithAmount.filter((item: IFreeportTransfer & {isPrimaryMarket: boolean}) => item.isPrimaryMarket),
    );
    // console.debug('nftTransfersWithElasticData', nftTransfersWithElasticData.length)
    for (const nftTransfer of nftTransfersWithElasticData) {
      if (+nftTransfer.amount === nftTransfer.elasticAmount) {
        console.log(
          `wallet ${nftTransfer.buyer}, nftTransfer.amount (${nftTransfer.amount}) == (${nftTransfer.elasticAmount}) nftTransfer.elasticAmount, OK`,
        );
      }
      if (+nftTransfer.amount > nftTransfer.elasticAmount) {
        console.warn(
          `wallet ${nftTransfer.buyer}, need to add data to elastic (elastic: ${nftTransfer.elasticAmount}, freeport: ${nftTransfer.amount})`,
        );
        if (CONF_UPDATE_DATA_IN_ELASTIC) {
          process.stdout.write('...adding ...');
          await eventApiService.sendEvent({
            accountId: `${nft.collection}_${nft.nftId}`,
            payload: {
              amount: 1,
              from: nftTransfer.creator,
              to: nftTransfer.buyer,
              nftId: nft.nftId,
              collectionAddress: nft.collection,
            },
            eventType: 'BLOCKCHAIN_FIAT_TRANSFER_SINGLE',
          });
          console.log('done');
        }
      }
      if (+nftTransfer.amount < nftTransfer.elasticAmount) {
        console.error(
          `wallet ${nftTransfer.buyer}, need to remove data to elastic (elastic: ${nftTransfer.elasticAmount}, freeport: ${nftTransfer.amount})`,
        );
      }
    }
    console.log(`Secondary market synchronization`);
    // console.log(util.inspect(nftTransfersWithElasticData, false, null, true /* enable colors */));
  }

  // let walletList = (await Promise.all(nftList.map((nft) => getWalletListByNft(nft)))).flat(1);
  // walletList = [...new Set(walletList)];
  // console.log('walletList', walletList);
  // walletList.forEach((wallet: string) => walletSync(wallet));
};

start();
