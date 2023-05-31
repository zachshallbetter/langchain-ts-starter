// src/gitService.ts
import simpleGit, { SimpleGit, CleanOptions } from "simple-git";
import fs from "fs/promises";
import path from "path";

export class GitService {
  private git: SimpleGit;
  private repoPath: string;

  constructor(repoPath: string) {
    this.repoPath = repoPath;
    this.git = simpleGit(this.repoPath);
  }

  async cloneRepo(repoUrl: string) {
    try {
      await this.git.clean(CleanOptions.FORCE);
      await this.git.clone(repoUrl, this.repoPath);
    } catch (error) {
      console.error('Error occurred while cloning repo:', error);
    }
  }

  async readRepoFiles(directoryPath: string): Promise<string[]> {
    try {
      const dir = await fs.readdir(path.join(this.repoPath, directoryPath));
      const fileContents = await Promise.all(
        dir.map(async (file) => {
          const filePath = path.join(this.repoPath, directoryPath, file);
          const content = await fs.readFile(filePath, "utf-8");
          return content;
        })
      );
      return fileContents;
    } catch (error) {
      console.error('Error occurred while reading files:', error);
      return [];
    }
  }
}
