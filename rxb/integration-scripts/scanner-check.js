function compareInLowerCase(a, b) {
  return String(a).toLowerCase() === String(b).toLowerCase();
}

function getFreeportOwnedNfts(wallet) {
  if (!wallet) {
    throw new Error('Wallet address is not defined');
  }

  const endpoint = `https://dev-freeport-api.network-dev.aws.cere.io`;
  const url = `${endpoint}/api/wallet/${wallet}/owned`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-Id': 'davinci',
    },
  };
  console.log('Request to: ' + url);

  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then((response) => {
        console.log('Request complete.');
        if (response.ok) {
          console.log('Request successful.');
          return response.json();
        } else {
          console.log('Request error: ' + response.status);
          throw new Error('Request failed with status code ' + response.status);
        }
      })
      .then((response) => {
        console.log('Response: ' + JSON.stringify(response));
        resolve(response);
      })
      .catch((error) => {
        console.log('Error: ' + error);
        reject(error);
      });
  });
}

async function getNftForUsing(eventNfts, wallet, usedNfts) {
  let userNfts;
  try {
    userNfts = await getFreeportOwnedNfts(wallet);
  } catch (e) {
    throw new Error(`Cannot get onwned nfts for the wallet ${wallet}`);
  }

  const enrichedEventNfts = eventNfts?.map((eventNft) => {
    const walletCount = userNfts
      .filter(
        (userNft) =>
          userNft?.nftId === eventNft.nftId && compareInLowerCase(userNft?.collection?.address, eventNft.collection),
      )
      .map((userNft) => userNft.balance)
      .reduce((acc, val) => +val + acc, 0);

    const walletUsedCount = usedNfts.filter(
      (nft) => nft.nftId === eventNft.nftId && compareInLowerCase(nft.collectionId, eventNft.collection),
    ).length;

    return {...eventNft, walletCount, walletUsedCount};
  });

  const result = enrichedEventNfts.find((nft) => nft.walletCount > nft.walletUsedCount);

  if (!result) {
    throw new Error(`Wallet doesn't any unused NFT for this event`);
  }

  return result;
}

sdk.transform(async (params) => {
  let errorMessage;
  const wallet = params.event.payload?.wallet;
  const eventNfts = params.event.payload?.eventNfts;
  const usedNfts = (params.queryData[0]?.hits?.hits || []).map((hit) => hit?._source?.payload);

  let checkResult;
  try {
    checkResult = await getNftForUsing(eventNfts, wallet, usedNfts);
  } catch (e) {
    errorMessage = e?.message || JSON.stringify(e);
  }

  const output = errorMessage
    ? {
        result: false,
        errorMessage,
      }
    : {
        data: {
          collectionId: checkResult.collection,
          nftId: checkResult.nftId,
          walletCount: checkResult.walletCount,
          walletUsedCount: checkResult.walletUsedCount,
        },
        result: true,
      };

  return {output: JSON.stringify(output), trigger: params.event.payload.trigger};
});
