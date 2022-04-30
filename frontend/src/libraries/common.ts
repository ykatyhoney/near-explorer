import { NetworkName } from "../types/common";
import { SubscriptionTopicType } from "../types/subscriptions";

// That's unfair as we actually change topic name
// But the types match so we'll keep it
export const wrapTopic = <T extends SubscriptionTopicType>(
  topic: T,
  networkName: NetworkName
): T => (`${networkName}.${topic}` as unknown) as T;
