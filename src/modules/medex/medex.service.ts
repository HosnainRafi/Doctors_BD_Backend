import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

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

  async getMedicineDetails(url: string) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    // Wait for the main content to load
    await page
      .waitForSelector(".brand-header h1", { timeout: 5000 })
      .catch(() => {});

    const data = await page.evaluate(() => {
      // Helper to get text
      const getText = (selector: string) =>
        document.querySelector(selector)?.textContent?.trim() || "";

      // Extract info block
      const infoDivs = document.querySelectorAll(
        ".brand-info-block > div[title]"
      );
      let genericName = "";
      let genericNameLink = "";
      let strength = "";
      let manufacturer = "";
      let manufacturerLink = "";

      infoDivs.forEach((div) => {
        const title = div.getAttribute("title")?.trim();
        if (!title) return;
        if (title === "Generic Name") {
          const link = div.querySelector("a");
          genericName = link?.textContent?.trim() || "";
          genericNameLink = link?.getAttribute("href") || "";
        }
        if (title === "Strength") {
          // Only get text nodes, ignore nested divs
          strength = Array.from(div.childNodes)
            .filter((n) => n.nodeType === Node.TEXT_NODE)
            .map((n) => n.textContent?.trim())
            .join(" ")
            .trim();
        }
        if (title === "Manufactured by") {
          const link = div.querySelector("a");
          manufacturer = link?.textContent?.trim() || "";
          manufacturerLink = link?.getAttribute("href") || "";
        }
      });

      // Get composition table
      let composition = "";
      const compRows = document.querySelectorAll(".composition-table tbody tr");
      compRows.forEach((row) => {
        const tds = row.querySelectorAll("td");
        if (tds.length >= 2) {
          composition += `• ${tds[0].textContent?.trim() || ""} - ${
            tds[1].textContent?.trim() || ""
          }\n`;
        }
      });

      // Get price and pack info
      let unitPrice = "";
      let stripPrice = "";
      let packInfo = "";
      const packageDiv = document.querySelector(".package-container");
      if (packageDiv) {
        const spans = packageDiv.querySelectorAll("span");
        for (let i = 0; i < spans.length; i++) {
          if (spans[i].textContent?.includes("Unit Price")) {
            unitPrice = spans[i + 1]?.textContent?.trim() || "";
          }
          if (spans[i].classList.contains("pack-size-info")) {
            packInfo = spans[i].textContent?.trim() || "";
          }
        }
        const divs = packageDiv.querySelectorAll("div");
        divs.forEach((div) => {
          if (div.textContent?.includes("Strip Price")) {
            const priceSpans = div.querySelectorAll("span");
            if (priceSpans.length) {
              stripPrice =
                priceSpans[priceSpans.length - 1].textContent?.trim() || "";
            }
          }
        });
      }

      // All sections you want
      const sections = [
        "indications",
        "composition",
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
      const sectionData: Record<string, string> = {};
      sections.forEach((sec) => {
        const header = document.querySelector(`div#${sec}`);
        if (header) {
          const body = header.nextElementSibling;
          if (body && body.classList.contains("ac-body")) {
            sectionData[sec] = body.textContent?.trim() || "";
          }
        }
      });

      return {
        name: getText(".brand-header h1"),
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
        url: window.location.href,
      };
    });

    await browser.close();
    return data;
  },
};
