import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

async function run() {
  try {
     const res = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
     console.log(JSON.stringify(res.data.models.map((m: any) => m.name), null, 2));
  } catch(e: any) {
     console.log(e.response?.data || e.message);
  }
}
run();
