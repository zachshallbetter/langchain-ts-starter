// src/gitService.ts
import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';
import { readdir, readFile, stat } from "fs/promises"; // Change 1
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
    const gitIgnorePath = path.resolve(this.repoPath, ".gitignore");
    const ig = ignore();
    const gitIgnoreContent = await readFile(gitIgnorePath, "utf-8").catch(() => ''); // Change 2
    ig.add(gitIgnoreContent); // Change 2
    return ig;
  }

  async readRepoFiles(directoryPath: string): Promise<string[]> {
    try {
      const ig = await this.getGitIgnore(); // Change 5
      const dir = await readdir(path.resolve(this.repoPath, directoryPath), { withFileTypes: true }); // Change 3
      const fileContents = []; // Change 4

      for await (const dirent of dir) { // Change 3
        const relativeFilePath = path.join(directoryPath, dirent.name);
        const filePath = path.resolve(this.repoPath, relativeFilePath); // Change 3

        if (dirent.isFile() && !ig.ignores(relativeFilePath)) {
          const content = await readFile(filePath, "utf-8");
          fileContents.push(content); // Change 3
        }
      }

      return fileContents; // Change 4
    } catch (error) {
      console.error('Error occurred while reading files:', error);
      return [];
    }
  }
}
