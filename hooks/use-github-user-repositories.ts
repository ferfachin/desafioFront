"use client";

import { useQuery } from "@tanstack/react-query";
import { getGitHubUserRepositories } from "@/services/github";
import { githubQueryKeys } from "./github-query-keys";

export function useGitHubUserRepositories(username: string) {
  const normalizedUsername = username.trim();

  return useQuery({
    queryKey: githubQueryKeys.userRepos(normalizedUsername),
    queryFn: () => getGitHubUserRepositories(normalizedUsername),
    enabled: normalizedUsername.length > 0,
  });
}
