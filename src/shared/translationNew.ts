import { translateIfBengali } from "./translateIfBengali";

// src/shared/translation.ts
export const translateObjectFieldsIfBengali = async (
  obj: any
): Promise<any> => {
  if (typeof obj === "string") {
    return await translateIfBengali(obj);
  }
  if (Array.isArray(obj)) {
    return Promise.all(obj.map(translateObjectFieldsIfBengali));
  }
  if (typeof obj === "object" && obj !== null) {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      result[key] = await translateObjectFieldsIfBengali(obj[key]);
    }
    return result;
  }
  return obj;
};
