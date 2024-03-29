# Making calls

Proposing multisig calls through the SDK is fairly simple and can be done in two different ways, let's go over them.

## Saturn specific calls

Within the SDK there are a few functions that are wrappers around the call builder, these are multisig specific operations that have to be called by the multisig account rather than by a member of the multisig. They can be built by calling methods in the `Saturn` class, here are some of them:

```typescript
// Build a call that sets multisig parameters.
saturn.setMultisigParameters({...});

// Build a call that adds a new member to the multisig.
saturn.proposeNewMember({...});

// Builds a call that bridges an asset over XCM form one chain to another.
saturn.transferXcmAsset({...});
```

These are convenience functions that are frequently used in Saturn, you'll find more of them explained in this document.

## General call builder

For anything that's not necessarily related with management of the multisig itself, you'll want to build calls externally and propose them through Saturn, for that we have a call builder method:

```typescript
// For Tinkernet calls, use .buildMultisigCall

const stakeCall = tinkernetApi.tx.ocifStaking.stake(0, "10000000000000");

saturn.buildMultisigCall({
  // The multisig id.
  id: 0,
  // The call to execute in Tinkernet
  call: stakeCall,
  // The asset to pay the transaction fee in Tinkernet.
  feeAsset: FeeAsset.Native,
  // Optional proposal metadata.
  proposalMetadata: "This is optional, but can be rather useful!"
});


// For other chains, use .sendXCMCall
// This is a wrapper that uses .buildMultisigCall internally.

const destination = "Basilisk";

const xcmFeeAsset = saturn.chains.find((c) => c.chain == "Basilisk").assets.find((asset) => asset.label == "BSX").registerType;

const swapCall = basiliskApi.tx.router.sell("KSM", "TNKR", "10000000000000", 0, [{ pool: "XYK", assetIn: "KSM", assetOut: "TNKR" }]);

const {weight, partialFee} = swapCall.paymentInfo("any address");

saturn.sendXCMCal({
    // The multisig id.
    id: number;
    // The destination chain.
    destination,
    // The actual call on the destination chain.
    callData: swapCall.toU8a(),
    // Optional proposal metadata.
    proposalMetadata: "This is optional, but can be rather useful!",
    // Weight for the call in the destination chain.
    weight: new BN(weight),
    // The fee for the XCM call and the transaction.
    // Multiplying by 2 is a conservative estimate.
    xcmFee: new BN(partialFee).mul("2"),
    // The asset to use when paying the fees in the destination chain.
    xcmFeeAsset,
})
```

## Submitting

Both of these methods return a [MultisigCall](https://saturn-typedocs.invarch.network/classes/MultisigCall.html) class, this can be then submitted by calling `.signAndSend`.
A [MultisigCallResult](https://saturn-typedocs.invarch.network/classes/MultisigCallResult.html) is returned after submitting the call.

```typescript
saturn.sendXCMCal({...}).signAndSend(
// Address of the multisig member proposing this call.
address,
// Signer with the member's account.
signer
// Optional FeeAsset used to pay for this transaction in Tinkernet.
// Will use the one set in the Saturn class if not provided.
FeeAsset.Relay
)
```

The [MultisigCallResult](https://saturn-typedocs.invarch.network/classes/MultisigCallResult.html) contains relevant information about the proposed call, it represents calls both proposed and those that were voted on and thus executed, the methods `.isExecuted` and `.isVoteStarted` help understand the status returned.
