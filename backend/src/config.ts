import { merge } from "lodash";
import { getOverrides, NetworkName } from "./client-types";
import { HOUR, MINUTE, SECOND } from "./consts";

export const config = merge(
  {
    archivalRpcUrl: "http://localhost:3030",
    networkName: "localhostnet" as NetworkName,
    accountIdSuffix: {
      lockup: "lockup.near",
      stakingPool: {
        mainnet: ".poolv1.near",
        testnet: ".f863973.m0",
      } as Partial<Record<NetworkName, string>>,
    },

    intervals: {
      checkFinalityStatus: SECOND,
      checkChainBlockStats: SECOND,
      checkRecentTransactions: SECOND,
      checkNetworkInfo: SECOND,
      checkStakingPoolInfo: 15 * SECOND,
      checkStakingPoolStakeProposal: MINUTE,
      checkValidatorDescriptions: 10 * MINUTE,
      checkTransactionCountHistory: 10 * MINUTE,
      checkAggregatedStats: HOUR,
      checkPoolIds: 10 * MINUTE,
    },
    timeouts: {
      timeoutStakingPoolsInfo: MINUTE,
      timeoutStakingPoolStakeProposal: MINUTE,
      timeoutFetchValidatorsBailout: 2.5 * SECOND,
    },

    wamp: {
      secure: false,
      port: 10000,
      host: "localhost",
      backendSecret: "THIS_IS_LOCALHOST_SECRET",
    },
  },
  getOverrides("NEAR_EXPLORER_CONFIG")
);
