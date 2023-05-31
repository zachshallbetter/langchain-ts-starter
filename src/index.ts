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
  const gitService = new GitService("./tempRepo");
  await gitService.cloneRepo(
    "https://github.com/zachshallbetter/langchain-ts-starter"
  );
  const fileContents = await gitService.readRepoFiles("src");

  for (const fileContent of fileContents) {
    const res = await model.call(`Review the following code: \n${fileContent}`);
    console.log(res);
  }
}

main().catch(console.error);
