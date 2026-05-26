"use client";

import { useQuery } from "@tanstack/react-query";
import { getGitHubRepositoryBranches } from "@/services/github";
import { githubQueryKeys } from "./github-query-keys";

export function useGitHubRepositoryBranches(owner: string, repo: string) {
  const normalizedOwner = owner.trim();
  const normalizedRepo = repo.trim();

  return useQuery({
    queryKey: githubQueryKeys.repoBranches(normalizedOwner, normalizedRepo),
    queryFn: () => getGitHubRepositoryBranches(normalizedOwner, normalizedRepo),
    enabled: normalizedOwner.length > 0 && normalizedRepo.length > 0,
  });
}
