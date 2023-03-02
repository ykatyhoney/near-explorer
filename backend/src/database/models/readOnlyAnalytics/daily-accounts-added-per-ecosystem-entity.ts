// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.daily_accounts_added_per_ecosystem_entity */
export type DailyAccountsAddedPerEcosystemEntityEntityId = string & {
  __flavor?: "DailyAccountsAddedPerEcosystemEntityEntityId";
};

/** Identifier type for public.daily_accounts_added_per_ecosystem_entity */
export type DailyAccountsAddedPerEcosystemEntityAccountId = string & {
  __flavor?: "DailyAccountsAddedPerEcosystemEntityAccountId";
};

/** Represents the table public.daily_accounts_added_per_ecosystem_entity */
export default interface DailyAccountsAddedPerEcosystemEntity {
  entity_id: DailyAccountsAddedPerEcosystemEntityEntityId;

  account_id: DailyAccountsAddedPerEcosystemEntityAccountId;

  added_at_block_timestamp: string;
}

/** Represents the initializer for the table public.daily_accounts_added_per_ecosystem_entity */
export interface DailyAccountsAddedPerEcosystemEntityInitializer {
  entity_id: DailyAccountsAddedPerEcosystemEntityEntityId;

  account_id: DailyAccountsAddedPerEcosystemEntityAccountId;

  added_at_block_timestamp: string;
}

/** Represents the mutator for the table public.daily_accounts_added_per_ecosystem_entity */
export interface DailyAccountsAddedPerEcosystemEntityMutator {
  entity_id?: DailyAccountsAddedPerEcosystemEntityEntityId;

  account_id?: DailyAccountsAddedPerEcosystemEntityAccountId;

  added_at_block_timestamp?: string;
}
