export const BIMax = (...args: bigint[]) =>
  args.reduce((m, e) => (e > m ? e : m));
export const BIMin = (...args: bigint[]) =>
  args.reduce((m, e) => (e < m ? e : m));

export const millisecondsToNanoseconds = (ms: number): bigint => {
  return BigInt(ms) * BigInt(10 ** 6);
};

export const nanosecondsToMilliseconds = (ns: bigint): number => {
  return Number(ns / BigInt(10 ** 6));
};