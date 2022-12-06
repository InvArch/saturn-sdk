import {
  GenerateMultisigParams,
  GetMultisigParams,
  Multisig,
  MultisigStatus,
} from "./types";

const generateMultisig = async ({
  threshold,
  defaultAssetWeight,
  defaultPermission,
  api,
}: GenerateMultisigParams): Promise<Multisig> => {
  const id = "123";

  return getMultisig({
    api,
    id,
  });
};

const getMultisig = async ({
  id,
  api,
}: GetMultisigParams): Promise<Multisig> => {
  let status: MultisigStatus = "OPEN";

  const addVote = async (address: string) => {};

  const removeVote = async (address: string) => {};

  const listOpenCalls = async () => [];

  const addNewCall = async (payload: {
    id: string;
    call: () => Promise<void>;
  }) => {};

  const removeCall = async (id: string) => {};

  const getBalance = async () => {
    return {
      limit: 100,
      filled: 50,
      total: 150,
    };
  };

  const getVoteWeight = async (address: string) => {
    return 100;
  };

  return {
    status,
    addVote,
    removeVote,
    listOpenCalls,
    addNewCall,
    removeCall,
    getBalance,
    getVoteWeight,
  };
};

/* const operateMultisig = async (
  api: ApiPromise,
  signer: string,
  id: number,
  fromBranch: string,
  toBranch: string,
  newHead: string,
  newRepoDataId: number,
  newMultiobjectId: number,
  oldRepoDataId: number
) => {
  await web3Enable("GitArch");

  await web3Accounts();

  const injector = await web3FromAddress(signer);

  await api.tx.inv4
    .operateMultisig(
      true,
      [id, null],
      JSON.stringify({
        protocol: "inv4-git",
        type: "merge",
        from: fromBranch,
        to: toBranch,
        newHead,
      }),
      api.tx.utility.batchAll([
        api.tx.inv4.remove(
          id,
          signer,
          [[api.createType("AnyId", { IpfId: oldRepoDataId }), signer]],
          null
        ),
        api.tx.inv4.append(
          id,
          signer,
          [
            api.createType("AnyId", { IpfId: newMultiobjectId }),
            api.createType("AnyId", { IpfId: newRepoDataId }),
          ],
          null
        ),
      ])
    )
    .signAndSend(
      signer,
      { signer: injector.signer },
      ({ events, status }: ISubmittableResult) => {
        if (status.isInvalid) {
          toast.error("Transaction is invalid");
        } else if (status.isReady) {
          toast.loading("Merging branch...");
        } else if (status.isDropped) {
          toast.error("Transaction dropped");
        } else if (status.isInBlock || status.isFinalized) {
          toast.dismiss();
          const multisigVoteStarted = events.find(
            ({ event }) => event.method === "MultisigVoteStarted"
          );

          const multisigExecuted = events.find(
            ({ event }) => event.method === "MultisigExecuted"
          );

          const failed = events.find(
            ({ event }) => event.method === "ExtrinsicFailed"
          );

          if (multisigExecuted) {
            toast.success("Merge performed!");
          } else if (multisigVoteStarted) {
            toast.success("Merge request opened!");

            const call_hash = (
              multisigVoteStarted.event.toPrimitive() as { call_hash: string }
            ).call_hash;
          } else if (failed) {
            toast.error("Merge failed.");

            console.error(failed.toHuman(true));
          } else throw new Error("UNKNOWN_RESULT");
        }
      }
    );
}; */
