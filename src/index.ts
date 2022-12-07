import "@polkadot/api-augment";

import { SubmittableExtrinsic } from "@polkadot/api/types";
import type { ISubmittableResult } from "@polkadot/types/types";
import type {
  CreateMultisigParams,
  GetMultisigParams,
  GetPendingMultisigCallsParams,
  GetSignAndSendCallbackParams,
} from "./types";

const getSignAndSendCallback = ({
  onDropped,
  onError,
  onExecuted,
  onInvalid,
  onLoading,
  onSuccess,
}: GetSignAndSendCallbackParams) => {
  return ({ events, status }: ISubmittableResult) => {
    if (status.isInvalid) {
      if (onInvalid) onInvalid();
    } else if (status.isReady) {
      if (onLoading) onLoading();
    } else if (status.isDropped) {
      if (onDropped) onDropped();
    } else if (status.isInBlock || status.isFinalized) {
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
        if (onSuccess) onSuccess();
      } else if (multisigVoteStarted) {
        if (onSuccess) onSuccess();
      } else if (failed) {
        if (onError) onError();

        console.error(failed.toHuman(true));
      } else throw new Error("UNKNOWN_RESULT");
    }

    if (onExecuted) onExecuted();
  };
};

const createMultisig = ({
  api,
  defaultAssetWeight,
  defaultPermission,
  executionThreshold,
  metadata,
  assets = [],
}: CreateMultisigParams): SubmittableExtrinsic<
  "promise",
  ISubmittableResult
> => {
  return api.tx.inv4.createIps(
    JSON.stringify(metadata),
    assets,
    false,
    "Apache2",
    api.createType("OneOrPercent", { Percent: executionThreshold }),
    api.createType("OneOrPercent", { Percent: defaultAssetWeight }),
    defaultPermission
  );
};

const getPendingMultisigCalls = ({
  api,
  id,
}: GetPendingMultisigCallsParams) => {
  return api.query.multisig.multisigs.entries(parseInt(id));
};

const getMultisig = ({ api, id }: GetMultisigParams) => {
  return api.query.inv4.ipStorage(parseInt(id));
};

export {
  getSignAndSendCallback,
  getPendingMultisigCalls,
  createMultisig,
  getMultisig,
};
