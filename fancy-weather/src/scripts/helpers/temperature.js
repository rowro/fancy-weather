export function apparentTemp(temp, wind) {
  return Math.round(35.74 + 0.6215 * temp - 35.75 * wind ** 0.16 + 0.4275 * temp * wind ** 0.16);
}
