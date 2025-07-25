import { translate } from "@vitalets/google-translate-api";

export const translateToEnglishIfBengali = async (
  text: string
): Promise<string> => {
  try {
    const result = await translate(text, { to: "en" });

    console.log("Translated Text:", result.text);

    return result.text;
  } catch (error) {
    console.error("Translation failed:", error);
    return text;
  }
};
