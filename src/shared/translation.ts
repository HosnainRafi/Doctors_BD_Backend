const googleTranslate = require("@vitalets/google-translate-api");

export const translateToEnglishIfBengali = async (
  text: string
): Promise<string> => {
  try {
    const result = await googleTranslate(text, { to: "en" });

    console.log("Detected Language:", result.from.language.iso);
    console.log("Translated Text:", result.text);

    return result.text;
  } catch (error) {
    console.error("Translation failed:", error);
    return text;
  }
};
