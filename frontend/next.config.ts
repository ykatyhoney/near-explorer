import { merge, cloneDeep } from "lodash";
import type { NextConfig } from "next";
import path from "path";
import type { Configuration } from "webpack";
// @ts-ignore
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

import type { NetworkName } from "@explorer/common/types/common";
import { getOverrides } from "@explorer/common/utils/environment";
import type {
  BackendConfig,
  ExplorerConfig,
  NearNetwork,
} from "@explorer/frontend/libraries/config";

const statsOptions = {
  baseDir: "stats",
  enabled: Boolean(process.env.STATS),
  openAnalyzer: Boolean(process.env.OPEN_ANALYZER),
};

const defaultBackendConfig: BackendConfig = {
  hosts: {
    mainnet: "localhost",
    testnet: "localhost",
    shardnet: "localhost",
    guildnet: "localhost",
    localnet: "localhost",
  },
  port: 10000,
  secure: false,
};

const config = merge(
  {
    backend: cloneDeep(defaultBackendConfig),
    backendSsr: cloneDeep(defaultBackendConfig),
    networks: {} as Partial<Record<NetworkName, NearNetwork>>,
    googleAnalytics: undefined,
    segmentWriteKey: "",
    gleapKey: undefined,
  },
  getOverrides("NEAR_EXPLORER_CONFIG")
);

const nextConfig: ExplorerConfig & NextConfig = {
  serverRuntimeConfig: {
    backendConfig: config.backendSsr,
  },
  publicRuntimeConfig: {
    nearNetworks: config.networks,
    backendConfig: config.backend,
    googleAnalytics: config.googleAnalytics,
    segmentWriteKey: config.segmentWriteKey,
    gleapKey: config.gleapKey,
  },
  webpack: (webpackConfig: Configuration, { isServer }): Configuration => ({
    ...webpackConfig,
    resolve: {
      ...webpackConfig.resolve,
      fallback: {
        ...webpackConfig.resolve?.fallback,
        // Fixes npm packages that depend on `fs` module
        fs: false,
        child_process: false,
      },
    },
    module: {
      ...webpackConfig.module,
      rules: [
        ...(webpackConfig.module?.rules ?? []),
        {
          test: /\.svg$/,
          use: ["@svgr/webpack"],
        },
      ],
    },
    plugins: statsOptions.enabled
      ? [
          ...(webpackConfig.plugins ?? []),
          // Analyzer with foam plot
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: statsOptions.openAnalyzer,
            reportFilename: isServer
              ? path.join(statsOptions.baseDir, "./server.html")
              : path.join(statsOptions.baseDir, "./client.html"),
            generateStatsFile: true,
          }),
        ]
      : webpackConfig.plugins,
  }),
  experimental: {
    externalDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
