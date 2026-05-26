"use client";

import { useQuery } from "@tanstack/react-query";
import { getGitHubUser } from "@/services/github";
import { githubQueryKeys } from "./github-query-keys";

export function useGitHubUser(username: string) {
  const normalizedUsername = username.trim();

  return useQuery({
    queryKey: githubQueryKeys.user(normalizedUsername),
    queryFn: () => getGitHubUser(normalizedUsername),
    enabled: normalizedUsername.length > 0,
  });
}
