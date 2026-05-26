export const githubQueryKeys = {
  user: (username: string) => ["github-user", username] as const,
  userRepos: (username: string) => ["github-user-repos", username] as const,
  repo: (owner: string, repo: string) => ["github-repo", owner, repo] as const,
};
