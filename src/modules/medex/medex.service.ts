import axios from "axios";
import * as cheerio from "cheerio";

export const MedexService = {
  async searchMedicine(query: string) {
    try {
      const url = `https://medex.com.bd/search?search=${encodeURIComponent(
        query
      )}`;

      const { data: html } = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Accept-Language": "en-US,en;q=0.9",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          Referer: "https://medex.com.bd/",
        },
      });

      const $ = cheerio.load(html);
      const results: any[] = [];

      $(".search-result-row").each((i, el) => {
        const name = $(el).find(".search-result-title a").text().trim();
        const href = $(el).find(".search-result-title a").attr("href") || "";
        const link = href.startsWith("http")
          ? href
          : `https://medex.com.bd${href}`;

        const img = $(el).find("img").attr("src");
        const description = $(el).find("p").text().trim();

        results.push({ name, link, img, description });
      });

      return results;
    } catch (error) {
      console.error("Error scraping Medex search:", error);
      return [];
    }
  },

  async getMedicineDetails(url: any) {
    try {
      const { data: html } = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Accept-Language": "en-US,en;q=0.9",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          Referer: "https://medex.com.bd/",
        },
      });

      const $ = cheerio.load(html);

      // Name
      const name = $(".brand-header h1").text().trim();

      // Info block
      let genericName = "";
      let genericNameLink = "";
      let strength = "";
      let manufacturer = "";
      let manufacturerLink = "";

      $(".brand-info-block > div[title]").each((i, el) => {
        const title = $(el).attr("title")?.trim();
        if (!title) return;
        if (title === "Generic Name") {
          const link = $(el).find("a");
          genericName = link.text().trim();
          genericNameLink = link.attr("href") || "";
        }
        if (title === "Strength") {
          // Only get text nodes, ignore nested divs
          strength = $(el)
            .contents()
            .filter(function () {
              return this.type === "text";
            })
            .text()
            .trim();
        }
        if (title === "Manufactured by") {
          const link = $(el).find("a");
          manufacturer = link.text().trim();
          manufacturerLink = link.attr("href") || "";
        }
      });

      // Composition table
      let composition = "";
      $(".composition-table tbody tr").each((i, row) => {
        const tds = $(row).find("td");
        if (tds.length >= 2) {
          const left = $(tds[0]).text().trim();
          const right = $(tds[1]).text().trim();
          if (left || right) {
            composition += `• ${left} - ${right}\n`;
          }
        }
      });

      // Price and pack info
      let unitPrice = "";
      let stripPrice = "";
      let packInfo = "";
      const packageDiv = $(".package-container");
      if (packageDiv.length) {
        packageDiv.find("span").each((i, span) => {
          const text = $(span).text();
          if (text.includes("Unit Price")) {
            unitPrice = $(span).next().text().trim();
          }
          if ($(span).hasClass("pack-size-info")) {
            packInfo = text.trim();
          }
        });
        packageDiv.find("div").each((i, div) => {
          const text = $(div).text();
          if (text.includes("Strip Price")) {
            const priceSpans = $(div).find("span");
            if (priceSpans.length) {
              stripPrice = $(priceSpans[priceSpans.length - 1])
                .text()
                .trim();
            }
          }
        });
      }

      // Sections
      const sections = [
        "indications",
        "composition",
        "pharmacology",
        "mode_of_action",
        "dosage",
        "interaction",
        "contraindications",
        "side_effects",
        "pregnancy_cat",
        "precautions",
        "overdose_effects",
        "drug_classes",
        "storage_conditions",
        "commonly_asked_questions",
      ];
      const sectionData: any = {};
      sections.forEach((sec) => {
        const header = $(`div#${sec}`);
        console.log(`Checking section: ${sec}, found:`, header.length);
        if (header.length) {
          const body = header.next();
          if (body.hasClass("ac-body")) {
            sectionData[sec] = body.text().trim();
          }
        }
      });

      return {
        name,
        genericName,
        genericNameLink,
        strength,
        manufacturer,
        manufacturerLink,
        composition,
        unitPrice,
        stripPrice,
        packInfo,
        ...sectionData,
        url,
      };
    } catch (error) {
      console.error("Error scraping Medex details:", error);
      return null;
    }
  },
};
