export const SUPPORTED_DISTRICTS = [
  "Rangpur",
  "Bogura",
  "Khulna",
  "Kushtia",
  "Pabna",
  "Sylhet",
  "Rajshahi",
  "Chittagong",
  "Barisal",
  "Dhaka",
  "Mymensingh",
  "Narayanganj",
];

export function extractSupportedDistrict(
  districtString: string
): string | null {
  if (!districtString) return null;
  // Split by space, "in", or comma, and check each part
  const parts = districtString.split(/[\s,]+/);
  // Check from the end (user usually says "in X" at the end)
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts.slice(i).join(" ").trim();
    if (
      SUPPORTED_DISTRICTS.some((d) => d.toLowerCase() === part.toLowerCase())
    ) {
      return part;
    }
  }
  // Fallback: check if any supported district is included as a substring
  for (const d of SUPPORTED_DISTRICTS) {
    if (districtString.toLowerCase().includes(d.toLowerCase())) {
      return d;
    }
  }
  return null;
}
