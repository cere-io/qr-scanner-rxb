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

async function checkData(collectionId, nftId, wallet, usedTicketCount) {
  let userNfts;
  try {
    userNfts = await getFreeportOwnedNfts(wallet);
  } catch (e) {
    throw new Error(`Cannot get onwned nfts for the wallet ${wallet}`);
  }

  const userNft = userNfts.find(
    (nft) => nft.collection.address.toLowerCase() === collectionId.toLowerCase() && nft.nftId === nftId,
  );
  if (!userNft) {
    throw new Error(`Wallet doesn't have this NFT`);
  }

  if (usedTicketCount >= userNft?.balance) {
    throw new Error(`The number of tickets used is greater than the number of tickets the user has`);
  }

  return {userNft};
}

sdk.transform(async (params) => {
  let errorMessage;
  const collectionId = params.event.payload?.collectionId;
  const nftId = params.event.payload?.nftId;
  const wallet = params.event.payload?.wallet;
  const usedTicketCount = params.queryData[0]?.hits?.total?.value || 0;

  let checkResult;
  try {
    checkResult = await checkData(collectionId, nftId, wallet, usedTicketCount);
  } catch (e) {
    errorMessage = e?.message || JSON.stringify(e);
  }

  const output = errorMessage
    ? {
        result: false,
        errorMessage,
      }
    : {
        data: {collectionId, nftId, wallet, checkResult, usedTicketCount},
        result: true,
      };

  return {output: JSON.stringify(output), trigger: params.event.payload.trigger};
});
