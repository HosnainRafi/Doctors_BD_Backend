export const hospitalFilterableFields = ["searchTerm"] as const;
export const hospitalPaginationFields = [
  "limit",
  "page",
  "sortBy",
  "sortOrder",
] as const;

export type HospitalFilterableFields =
  (typeof hospitalFilterableFields)[number];
export type HospitalPaginationFields =
  (typeof hospitalPaginationFields)[number];
