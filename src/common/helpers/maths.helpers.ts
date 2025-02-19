/**
 * Returns the mean (average) of two big numbers as a BigInt.
 * Accepts inputs as either BigInt or string.
 */
export function bigIntMean(a: string | bigint, b: string | bigint): string {
  const bigA = typeof a === 'bigint' ? a : BigInt(a);
  const bigB = typeof b === 'bigint' ? b : BigInt(b);
  return ((bigA + bigB) / 2n).toString();
}