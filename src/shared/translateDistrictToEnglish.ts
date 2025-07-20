import { translateToEnglishIfBengali } from "./translation";

const bengaliDistrictMap: Record<string, string> = {
  ঢাকা: "Dhaka",
  গাজীপুর: "Gazipur",
  নারায়ণগঞ্জ: "Narayanganj",
  টাঙ্গাইল: "Tangail",
  কিশোরগঞ্জ: "Kishoreganj",
  ময়মনসিংহ: "Mymensingh",
  নেত্রকোনা: "Netrokona",
  জামালপুর: "Jamalpur",
  শেরপুর: "Sherpur",
  নরসিংদী: "Narsingdi",
  মানিকগঞ্জ: "Manikganj",
  মুন্সিগঞ্জ: "Munshiganj",
  রাজবাড়ী: "Rajbari",
  ফরিদপুর: "Faridpur",
  গোপালগঞ্জ: "Gopalganj",
  মাদারীপুর: "Madaripur",
  শরীয়তপুর: "Shariatpur",
  চট্টগ্রাম: "Chittagong",
  কক্সবাজার: "Cox's Bazar",
  বান্দরবান: "Bandarban",
  রাঙ্গামাটি: "Rangamati",
  খাগড়াছড়ি: "Khagrachari",
  ফেনী: "Feni",
  নোয়াখালী: "Noakhali",
  লক্ষ্মীপুর: "Laxmipur",
  চাঁদপুর: "Chandpur",
  কুমিল্লা: "Comilla",
  ব্রাহ্মণবাড়িয়া: "Brahmanbaria",
  সিলেট: "Sylhet",
  সুনামগঞ্জ: "Sunamganj",
  মৌলভীবাজার: "Moulvibazar",
  হবিগঞ্জ: "Habiganj",
  খুলনা: "Khulna",
  বাগেরহাট: "Bagerhat",
  সাতক্ষীরা: "Satkhira",
  যশোর: "Jessore",
  ঝিনাইদহ: "Jhenaidah",
  মাগুরা: "Magura",
  নড়াইল: "Narail",
  কুষ্টিয়া: "Kushtia",
  মেহেরপুর: "Meherpur",
  চুয়াডাঙ্গা: "Chuadanga",
  বরিশাল: "Barisal",
  পটুয়াখালী: "Patuakhali",
  ভোলা: "Bhola",
  পিরোজপুর: "Pirojpur",
  ঝালকাঠি: "Jhalokathi",
  বরগুনা: "Barguna",
  রাজশাহী: "Rajshahi",
  নাটোর: "Natore",
  নওগাঁ: "Naogaon",
  চাঁপাইনবাবগঞ্জ: "Chapai Nawabganj",
  পাবনা: "Pabna",
  সিরাজগঞ্জ: "Sirajganj",
  বগুড়া: "Bogura",
  জয়পুরহাট: "Joypurhat",
  রংপুর: "Rangpur",
  দিনাজপুর: "Dinajpur",
  ঠাকুরগাঁও: "Thakurgaon",
  পঞ্চগড়: "Panchagarh",
  নীলফামারী: "Nilphamari",
  লালমনিরহাট: "Lalmonirhat",
  কুড়িগ্রাম: "Kurigram",
  গাইবান্ধা: "Gaibandha",
  // (Some districts may repeat due to administrative changes, but this covers all unique ones)
};

const containsBengali = (text: string) => /[\u0980-\u09FF]/.test(text);

const normalizeBengali = (text: string) => text.trim().replace(/\s+/g, "");

export const translateDistrictToEnglish = async (
  district: string
): Promise<string> => {
  const normalized = normalizeBengali(district);
  if (bengaliDistrictMap[normalized]) {
    return bengaliDistrictMap[normalized];
  }
  // Fallback to Google Translate if not found in map
  return await translateToEnglishIfBengali(district);
};
