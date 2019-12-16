/**
 * Convert Celsius to Fahrenheit
 * Return rounded value
 * @param celsius
 * @returns {number}
 */
export default function toFahrenheit(celsius) {
  return Math.floor(celsius * 1.8 + 32);
}
