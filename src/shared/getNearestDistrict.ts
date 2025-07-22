// src/shared/getNearestDistrict.ts

const districtsWithCoords = [
  { name: "Rangpur", lat: 25.7463, lon: 89.2517 },
  { name: "Bogura", lat: 24.8465, lon: 89.3776 },
  { name: "Khulna", lat: 22.8456, lon: 89.5403 },
  { name: "Kushtia", lat: 23.901, lon: 89.122 },
  { name: "Pabna", lat: 24.0064, lon: 89.2372 },
  { name: "Sylhet", lat: 24.8949, lon: 91.8687 },
  { name: "Rajshahi", lat: 24.3745, lon: 88.6042 },
  { name: "Chittagong", lat: 22.3569, lon: 91.7832 },
  { name: "Barisal", lat: 22.701, lon: 90.3535 },
  { name: "Dhaka", lat: 23.8103, lon: 90.4125 },
  { name: "Mymensingh", lat: 24.7539, lon: 90.4073 },
  { name: "Narayanganj", lat: 23.6238, lon: 90.5 },
];

export function getNearestDistrict(
  userLat: number,
  userLon: number
): string | null {
  const toRad = (value: number) => (value * Math.PI) / 180;
  let nearest: string | null = null;
  let minDist = Infinity;

  for (const district of districtsWithCoords) {
    const dLat = toRad(district.lat - userLat);
    const dLon = toRad(district.lon - userLon);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(userLat)) *
        Math.cos(toRad(district.lat)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const R = 6371; // Earth radius in km

    const distance = R * c;

    if (distance < minDist) {
      minDist = distance;
      nearest = district.name;
    }
  }

  return nearest;
}
