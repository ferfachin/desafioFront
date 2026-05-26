"use client";

import { useQuery } from "@tanstack/react-query";
import { getGitHubRepository } from "@/services/github";
import { githubQueryKeys } from "./github-query-keys";

export function useGitHubRepository(owner: string, repo: string) {
  const normalizedOwner = owner.trim();
  const normalizedRepo = repo.trim();

  return useQuery({
    queryKey: githubQueryKeys.repo(normalizedOwner, normalizedRepo),
    queryFn: () => getGitHubRepository(normalizedOwner, normalizedRepo),
    enabled: normalizedOwner.length > 0 && normalizedRepo.length > 0,
  });
}
