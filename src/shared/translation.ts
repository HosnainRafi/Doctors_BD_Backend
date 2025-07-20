// src/shared/translation.ts
import axios from "axios";

export const translateToEnglishIfBengali = async (
  text: string
): Promise<string> => {
  try {
    const response = await axios.post(
      "https://libretranslate.com/translate",
      {
        q: text,
        source: "auto",
        target: "en",
        format: "text",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.translatedText || text;
  } catch (error) {
    console.error("Translation failed:", error);
    return text; // Fallback to original input
  }
};
