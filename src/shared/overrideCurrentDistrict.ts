export function smartCleanDistrict(prompt: string, aiDistrict: string): string {
  const lowerPrompt = prompt.toLowerCase();
  const lowerDistrict = aiDistrict.toLowerCase();

  // 1. Handle "around", "near", "beside", "of" etc.
  const nearbyMatch = lowerPrompt.match(
    /(?:around|near|beside|of)\s+([a-z\s]+)/i
  );
  console.log(nearbyMatch);
  if (nearbyMatch && nearbyMatch[1]) {
    const extracted = nearbyMatch[1].trim().replace(/[.,]/g, "");
    return capitalize(extracted);
  }

  // 2. If AI returned mixed value like "Dhaka in kushtia", split and choose last "in" value
  const inMatch = lowerDistrict.match(/in\s+([a-z\s]+)/i);
  if (inMatch && inMatch[1]) {
    const extracted = inMatch[1].trim().replace(/[.,]/g, "");
    return capitalize(extracted);
  }

  // 3. Clean fallback: if AI just gave "Dhaka in kushtia"
  const split = lowerDistrict.split(" in ");
  if (split.length > 1) {
    return capitalize(split[split.length - 1].trim());
  }

  return capitalize(lowerDistrict); // fallback
}

function capitalize(str: string): string {
  return str
    .split(" ")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}
