/**
 * Returns true if a 6-digit hex color is perceptually light (needs dark ink text).
 */
export function isLightHexColor(hex?: string): boolean {
  if (!hex || !/^#[0-9A-Fa-f]{6}$/.test(hex)) return true; // Default Granola cream is light
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Relative luminance (WCAG)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62;
}
