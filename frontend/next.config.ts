import { NextConfig } from "next";
import {
  BackendConfig,
  ExplorerConfig,
  NearNetwork,
} from "./src/libraries/config";
import { NetworkName } from "./src/types/common";

const getBackendConfig = (networkNames: NetworkName[]): BackendConfig => {
  const pubSubPort = Number(process.env.NEAR_EXPLORER_PUBSUB_PORT);
  const defaultHost = process.env.NEAR_EXPLORER_PUBSUB_HOST || "localhost";
  return {
    hosts: networkNames.reduce<Partial<Record<NetworkName, string>>>(
      (acc, networkName) => {
        const networkHost =
          process.env[`NEAR_EXPLORER_PUBSUB_${networkName.toUpperCase()}_HOST`];
        acc[networkName] = networkHost || defaultHost;
        return acc;
      },
      {}
    ),
    port: isNaN(pubSubPort) ? 10000 : pubSubPort,
    secure: process.env.NEAR_EXPLORER_PUBSUB_SECURE !== "false",
  };
};

let nearNetworks: NearNetwork[];
if (process.env.NEAR_NETWORKS) {
  nearNetworks = JSON.parse(process.env.NEAR_NETWORKS);
} else {
  nearNetworks = [
    {
      name: "localhostnet",
      explorerLink: "http://localhost:3000",
      nearWalletProfilePrefix: "https://wallet.near.org/profile",
    },
  ];
}

const networkNames = nearNetworks.map((network) => network.name);
const config: ExplorerConfig & NextConfig = {
  serverRuntimeConfig: {
    backendConfig: getBackendConfig(networkNames),
  },
  publicRuntimeConfig: {
    nearNetworks,
    backendConfig: getBackendConfig(networkNames),
    googleAnalytics: process.env.NEAR_EXPLORER_GOOGLE_ANALYTICS,
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export = config;
