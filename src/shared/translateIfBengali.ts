import { translateToEnglishIfBengali } from "./translation";

export const translateIfBengali = async (text: string): Promise<string> => {
  return text && /[\u0980-\u09FF]/.test(text)
    ? await translateToEnglishIfBengali(text)
    : text;
};
