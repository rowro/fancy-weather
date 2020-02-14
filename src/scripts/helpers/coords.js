/**
 * Format latitude and longitude
 * Example: 32.4544 => 32°45
 * @param coords
 * @returns {string}
 */
export default function formatCoords(coords) {
  return Number(coords).toFixed(2).replace('.', '°');
}
