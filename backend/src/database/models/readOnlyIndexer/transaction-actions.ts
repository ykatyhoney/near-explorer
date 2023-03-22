// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type ActionKind from "./action-kind";
import type { TransactionsTransactionHash } from "./transactions";

/** Identifier type for public.transaction_actions */
export type TransactionActionsIndexInTransaction = number & {
  __flavor?: "TransactionActionsIndexInTransaction";
};

/** Represents the table public.transaction_actions */
export default interface TransactionActions {
  transaction_hash: TransactionsTransactionHash;

  index_in_transaction: TransactionActionsIndexInTransaction;

  action_kind: ActionKind;

  args:
    | {
        public_key: string;
        access_key: {
          nonce: number;
          permission:
            | {
                permission_kind: "FUNCTION_CALL";
                permission_details: {
                  allowance: string;
                  receiver_id: string;
                  method_names: string[];
                };
              }
            | {
                permission_kind: "FULL_ACCESS";
              };
        };
      }
    | {}
    | { beneficiary_id: string }
    | { public_key: string }
    | { code_sha256: string }
    | {
        gas: number;
        deposit: string;
        method_name: string;
        args_json?: Record<string, unknown>;
        args_base64: string;
      }
    | {
        public_key: string;
        stake: string;
      }
    | { deposit: string };

  is_delegate_action: boolean;

  delegate_parameters: unknown | null;

  delegate_parent_index_in_transaction: number | null;
}

/** Represents the initializer for the table public.transaction_actions */
export interface TransactionActionsInitializer {
  transaction_hash: TransactionsTransactionHash;

  index_in_transaction: TransactionActionsIndexInTransaction;

  action_kind: ActionKind;

  args:
    | {
        public_key: string;
        access_key: {
          nonce: number;
          permission:
            | {
                permission_kind: "FUNCTION_CALL";
                permission_details: {
                  allowance: string;
                  receiver_id: string;
                  method_names: string[];
                };
              }
            | {
                permission_kind: "FULL_ACCESS";
              };
        };
      }
    | {}
    | { beneficiary_id: string }
    | { public_key: string }
    | { code_sha256: string }
    | {
        gas: number;
        deposit: string;
        method_name: string;
        args_json?: Record<string, unknown>;
        args_base64: string;
      }
    | {
        public_key: string;
        stake: string;
      }
    | { deposit: string };

  is_delegate_action: boolean;

  delegate_parameters?: unknown | null;

  delegate_parent_index_in_transaction?: number | null;
}

/** Represents the mutator for the table public.transaction_actions */
export interface TransactionActionsMutator {
  transaction_hash?: TransactionsTransactionHash;

  index_in_transaction?: TransactionActionsIndexInTransaction;

  action_kind?: ActionKind;

  args?:
    | {
        public_key: string;
        access_key: {
          nonce: number;
          permission:
            | {
                permission_kind: "FUNCTION_CALL";
                permission_details: {
                  allowance: string;
                  receiver_id: string;
                  method_names: string[];
                };
              }
            | {
                permission_kind: "FULL_ACCESS";
              };
        };
      }
    | {}
    | { beneficiary_id: string }
    | { public_key: string }
    | { code_sha256: string }
    | {
        gas: number;
        deposit: string;
        method_name: string;
        args_json?: Record<string, unknown>;
        args_base64: string;
      }
    | {
        public_key: string;
        stake: string;
      }
    | { deposit: string };

  is_delegate_action?: boolean;

  delegate_parameters?: unknown | null;

  delegate_parent_index_in_transaction?: number | null;
}
