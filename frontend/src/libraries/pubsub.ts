import ReconnectingWebSocket from "reconnecting-websocket";
import { getConfig, NearNetwork } from "./config";
import {
  IncomingMessage,
  OutcomingMessage,
  SubscriptionTopicType,
  SubscriptionTopicTypes,
} from "../types/subscriptions";
import { wrapTopic } from "./common";
import { NetworkName } from "../types/common";

type UnsubscribeFn = () => void;

type CachedItem<T extends SubscriptionTopicType> = {
  subscription?: {
    handler: (data: SubscriptionTopicTypes[T]) => void;
    unsubscribe: UnsubscribeFn;
  };
  lastValue?: SubscriptionTopicTypes[T];
};

type Session = {
  subscribe: <T extends SubscriptionTopicType>(topic: T) => void;
};

const sessions: Partial<Record<NetworkName, Session>> = {};
// We keep cache to update newly subscribed handlers immediately
let subscriptionCache: Partial<
  {
    [T in SubscriptionTopicType]: CachedItem<T>;
  }
> = {};

const getSession = (nearNetwork: NetworkName): Session => {
  if (!sessions[nearNetwork]) {
    const {
      publicRuntimeConfig: { backendConfig },
    } = getConfig();
    if (!backendConfig.hosts[nearNetwork]) {
      throw new Error(`Network ${nearNetwork} is not supported on this host`);
    }
    const url = `${backendConfig.secure ? "wss" : "ws"}://${
      backendConfig.hosts[nearNetwork]
    }:${backendConfig.port}/ws`;
    const ws = new ReconnectingWebSocket(url);
    ws.addEventListener(
      "message",
      <T extends SubscriptionTopicType>(event: MessageEvent) => {
        const [topic, data] = JSON.parse(event.data) as IncomingMessage<T>;
        const cacheItem = subscriptionCache[topic];
        if (cacheItem) {
          cacheItem.lastValue = data;
          const subscription = cacheItem.subscription;
          if (subscription) {
            // TODO: fix types
            subscription.handler(data as any);
          }
        }
      }
    );
    // reconnect
    ws.addEventListener("open", () =>
      Object.keys(subscriptionCache).forEach((cachedTopic) =>
        sendMessage(["sub", cachedTopic as SubscriptionTopicType])
      )
    );
    const sendMessage = (message: OutcomingMessage) => {
      if (ws.readyState !== 1) {
        return;
      }
      const [type, topic] = message;
      ws.send(JSON.stringify([type, topic]));
    };
    sessions[nearNetwork] = {
      subscribe: (topic) => {
        sendMessage(["sub", topic]);
        return () => sendMessage(["unsub", topic]);
      },
    };
  }
  return sessions[nearNetwork]!;
};

export const subscribeTopic = async <T extends SubscriptionTopicType>(
  topic: T,
  nearNetwork: NearNetwork,
  handler: (data: SubscriptionTopicTypes[T]) => void
): Promise<void> => {
  const wrappedTopic = wrapTopic(topic, nearNetwork.name);
  if (subscriptionCache[wrappedTopic]) {
    return;
  }
  const cachedItem: CachedItem<T> = {};
  // TODO: fix types
  subscriptionCache[wrappedTopic] = cachedItem as any;
  const session = getSession(nearNetwork.name);
  cachedItem.subscription = {
    handler: (data) => {
      handler(data);
      const cachedTopic = subscriptionCache[wrappedTopic];
      if (!cachedTopic) {
        // Bail-out in case we have a race condition of this callback and unsubscription
        return;
      }
      cachedTopic.lastValue = data;
    },
    unsubscribe: () => session.subscribe(wrappedTopic),
  };
};

export const unsubscribeTopic = async <T extends SubscriptionTopicType>(
  topic: T,
  nearNetwork: NearNetwork
): Promise<void> => {
  const wrappedTopic = wrapTopic(topic, nearNetwork.name);
  const cacheItem = subscriptionCache[wrappedTopic];
  if (!cacheItem) {
    return;
  }
  delete subscriptionCache[wrappedTopic];
  await cacheItem.subscription?.unsubscribe();
};

export const getLastValue = <T extends SubscriptionTopicType>(
  topic: T,
  nearNetwork: NearNetwork
): SubscriptionTopicTypes[T] | undefined => {
  const wrappedTopic = wrapTopic(topic, nearNetwork.name);
  const cacheItem = subscriptionCache[wrappedTopic];
  if (!cacheItem) {
    return;
  }
  // TODO: fix types
  return (cacheItem as any).lastValue;
};
