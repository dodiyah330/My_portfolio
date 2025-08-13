import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000; // 2 seconds

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateContentWithRetry(model, prompt, retries = MAX_RETRIES) {
  let lastError;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt < retries) {
        console.log(`Retrying in ${RETRY_DELAY_MS/1000} seconds...`);
        await sleep(RETRY_DELAY_MS);
      }
    }
  }
  
  throw new Error(`Failed after ${retries} attempts. Last error: ${lastError.message}`);
}

async function main() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    const filePath = process.argv[2];
    if (!filePath) {
      throw new Error('Please provide a file path as an argument');
    }

    const code = fs.readFileSync(filePath, "utf-8");
    const prompt = `You are a senior code reviewer. Review the following code for bugs, optimizations, and clarity. Respond in GitHub markdown: \n\n${code}`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyB8arsLNyL-r9qd9vs4TX4RGNqnVkn5amA");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log('Starting code review...');
    const review = await generateContentWithRetry(model, prompt);
    console.log(review);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
