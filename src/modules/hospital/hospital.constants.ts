// hospital.constants.ts
export const hospitalFilterableFields = ["searchTerm", "isActive"] as const;
export const hospitalPaginationFields = [
  "limit",
  "page",
  "sortBy",
  "sortOrder",
] as const;

// Extract literal types
export type HospitalFilterableFields =
  (typeof hospitalFilterableFields)[number];
export type HospitalPaginationFields =
  (typeof hospitalPaginationFields)[number];
