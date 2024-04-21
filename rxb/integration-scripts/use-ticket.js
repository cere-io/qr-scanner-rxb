function later(delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}

sdk.transform(async (params) => {
  let errorMessage;
  const collectionId = params.event.payload?.collectionId;
  const nftId = params.event.payload?.nftId;
  const wallet = params.event.payload?.wallet;
  const usedTickets = params.queryData[0]?.hits?.total?.value || 0;

  let checkResult;
  try {
    checkResult = await later(5000);
  } catch (e) {
    errorMessage = e?.message || JSON.stringify(e);
  }

  const output = errorMessage
    ? {
        result: false,
        errorMessage,
      }
    : {
        data: {collectionId, nftId, wallet, checkResult, params: JSON.stringify(params), usedTickets},
        result: true,
      };

  return {output: JSON.stringify(output), trigger: params.event.payload.trigger};
});
