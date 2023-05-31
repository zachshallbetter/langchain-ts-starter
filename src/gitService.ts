// src/gitService.ts
import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';
import fs from "fs/promises";
import path from "path";
import ignore from "ignore";

export class GitService {
  private git: SimpleGit = simpleGit().clean(CleanOptions.FORCE);
  private repoPath: string;

  constructor(repoPath: string) {
    this.repoPath = repoPath;
    this.git = simpleGit(this.repoPath);
  }

  async getGitIgnore() {
    const gitIgnorePath = path.join(this.repoPath, ".gitignore");
    const ig = ignore();
    try {
      const gitIgnoreContent = await fs.readFile(gitIgnorePath, "utf-8");
      ig.add(gitIgnoreContent);
    } catch (error) {
      // .gitignore file not found, we will ignore nothing
    }
    return ig;
  }

  async readRepoFiles(directoryPath: string): Promise<string[]> {
    try {
      const dir = await fs.readdir(path.join(this.repoPath, directoryPath));
      const ig = await this.getGitIgnore();
      const fileContents = await Promise.all(
        dir.map(async (file) => {
          const relativeFilePath = path.join(directoryPath, file);
          const filePath = path.join(this.repoPath, relativeFilePath);
          const stats = await fs.stat(filePath);

          if (stats.isFile() && !ig.ignores(relativeFilePath)) {
            const content = await fs.readFile(filePath, "utf-8");
            return content;
          }
        })
      );
      return fileContents.filter(Boolean) as string[];
    } catch (error) {
      console.error('Error occurred while reading files:', error);
      return [];
    }
  }
}
