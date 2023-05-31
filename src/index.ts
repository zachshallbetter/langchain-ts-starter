// src/index.ts
import * as dotenv from "dotenv";
import { OpenAI } from "langchain";
import { GitService } from "./gitService.ts";

dotenv.config();

const model = new OpenAI({
  modelName: "gpt-3.5-turbo",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const gitService = new GitService("./");
  const fileContents = await gitService.readRepoFiles("src");

  // Store all the file contents
  let allFileContents = fileContents.join("\n\n");

  // Now you can ask questions about the code
  const questions = [
    "how can we extend this code?",
    // "Can this code be optimized?",
    // "Is there any potential bug in this code?",
  ];

  for (const question of questions) {
    const prompt = `${question}\n\nCode:\n${allFileContents}`;
    const res = await model.call(prompt);
    console.log(res);
  }
}

main().catch(console.error);
