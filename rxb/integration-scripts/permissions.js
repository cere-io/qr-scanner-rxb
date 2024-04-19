sdk.transform((params) => {
  const permissions = {
    // {[key = `eventId`]: [email of gate keeper]}
    25: ['aleksei.s@cere.io'],
    26: ['aleksei.s@cere.io', 'a.svetlitskiy@gmail.com'],
    27: ['aleksei.s@cere.io', 'a.svetlitskiy@gmail.com'],
    29: ['aleksei.s@cere.io', 'a.svetlitskiy@gmail.com'],
    30: ['aleksei.s@cere.io', 'a.svetlitskiy@gmail.com'],
    31: ['aleksei.s@cere.io', 'a.svetlitskiy@gmail.com'],
    32: ['aleksei.s@cere.io', 'a.svetlitskiy@gmail.com'],
  };

  const output = {
    nftId: params.event.payload.nftId,
    collectionId: params.event.payload.collectionId,
    wallet: params.event.payload.wallet,
    permissions,
  };

  console.log('Output: ', output);

  return {output: JSON.stringify(output), trigger: params.event.payload.trigger};
});
