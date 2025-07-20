import { translateDistrictToEnglish } from "./translateDistrictToEnglish";
import { translateIfBengali } from "./translateIfBengali";

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
      if (key === "district" && obj[key]) {
        // Always map district to English
        result[key] = await translateDistrictToEnglish(obj[key]);
      } else {
        result[key] = await translateObjectFieldsIfBengali(obj[key]);
      }
    }
    return result;
  }
  return obj;
};
