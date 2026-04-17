import { GoogleGenAI } from "@google/genai";

const key = process.env.API_KEY || process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: key });

async function getDomainInfo() {
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
    model: "gemini-3.1-pro-preview",
    contents: `Check availability and pricing for: ${domains.join(", ")}. 
    Compare Cloudflare, Porkbun, and Namecheap for long-term ownership. 
    Draft a professional voicemail for 'The Well Lived Citizen' (Luxury Home Org + Resale). 
    Provide step-by-step instructions for a Squarespace domain redirect for daynabrown.com to a new URL.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  console.log(response.text);
}

getDomainInfo();
