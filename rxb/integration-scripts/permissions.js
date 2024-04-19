sdk.transform((params) => {
  const permissions = {
    // {[key = `eventId`]: [email of gate keeper]}
    30: ['aleksei.s@cere.io', 'evgeny@cere.io', 'irfan.akarsu@cere.io'],
    31: ['aleksei.s@cere.io', 'evgeny@cere.io', 'irfan.akarsu@cere.io'],
  };

  const output = {
    nftId: params.event.payload.nftId,
    collectionId: params.event.payload.collectionId,
    wallet: params.event.payload.wallet,
    permissions,
  };

  return {output: JSON.stringify(output), trigger: params.event.payload.trigger};
});
