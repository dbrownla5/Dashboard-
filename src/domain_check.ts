import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function checkDomainsAndPricing() {
  const domains = [
    "thewelllivedLA.com",
    "wornwell.com",
    "wornwellLA.com",
    "wellplaced.com",
    "wellplacedLA.com",
    "thewelllived.com",
    "welllivedcitizen.com"
  ];

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Check the availability and current registration/renewal pricing for the following domains: ${domains.join(", ")}. 
    Also, research and compare the best/cheapest domain registrars for bundles or long-term ownership (Cloudflare, Porkbun, Namecheap, etc.) to find a better deal than Namecheap's renewal rates. 
    Finally, provide a polished, professional voicemail script for a Google Voice number for 'The Well Lived Citizen' (Luxury Home Org + Resale).`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  console.log(response.text);
}

checkDomainsAndPricing();
