import * as React from "react";
import analytics, { AnalyticsEvent } from "./analytics";

export const useAnalyticsTrack = () => {
  return React.useCallback<(event: string, args?: AnalyticsEvent) => void>(
    (event, args) => analytics.track(event, args),
    []
  );
};
