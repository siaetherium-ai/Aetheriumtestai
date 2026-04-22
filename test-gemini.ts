import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const aiModel = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

async function run() {
  try {
    const chat = aiModel.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
    });
    const result = await chat.sendMessage("Hola");
    console.log(result.response.text());
  } catch (error: any) {
    console.error("EXACT ERROR MESSAGE:", error.message);
  }
}
run();
