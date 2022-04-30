import { getConfig, NearNetwork } from "./config";
import { subscribeTopic, getLastValue, unsubscribeTopic } from "./pubsub";
import {
  SubscriptionTopicType,
  SubscriptionTopicTypes,
} from "../types/subscriptions";
import {
  ProcedureType,
  ProcedureArgs,
  ProcedureResult,
} from "../types/procedures";

let subscriptions: Record<string, ((data: any) => void)[]> = {};

export const subscribe = <T extends SubscriptionTopicType>(
  nearNetwork: NearNetwork,
  topic: T,
  handler: (data: SubscriptionTopicTypes[T]) => void
): (() => void) => {
  if (!subscriptions[topic]) {
    subscriptions[topic] = [];
  }
  subscriptions[topic].push(handler);
  void subscribeTopic(topic, nearNetwork, (data) =>
    subscriptions[topic].forEach((handler) => handler(data))
  );
  const lastValue = getLastValue(topic, nearNetwork);
  if (lastValue) {
    handler(lastValue);
  }
  return () => {
    subscriptions[topic] = subscriptions[topic].filter(
      (lookupHandler) => lookupHandler !== handler
    );
    void unsubscribeTopic(topic, nearNetwork);
  };
};

export type Fetcher = <P extends ProcedureType>(
  procedure: P,
  args: ProcedureArgs<P>
) => Promise<ProcedureResult<P>>;

export const fetchProcedure = async <P extends ProcedureType>(
  procedure: P,
  nearNetwork: NearNetwork,
  args: ProcedureArgs<P>
): Promise<ProcedureResult<P>> => {
  const {
    publicRuntimeConfig: { backendConfig },
  } = getConfig();
  const host = backendConfig.hosts[nearNetwork.name];
  if (!host) {
    throw new Error(`Network ${nearNetwork} is not supported on this host`);
  }
  const baseUrl = `${backendConfig.secure ? "https" : "http"}://${host}:${
    backendConfig.port
  }/`;
  const response = await fetch(
    baseUrl + procedure + `?network=${nearNetwork.name}`,
    {
      method: "POST",
      body: JSON.stringify(args),
    }
  );
  const json = await response.json();
  return json as ProcedureResult<P>;
};

export const getFetcher = (nearNetwork: NearNetwork): Fetcher => (
  procedure,
  args
) => fetchProcedure(procedure, nearNetwork, args);
