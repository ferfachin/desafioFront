export type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  followers: number;
  following: number;
  email: string | null;
  bio: string | null;
};

export type GitHubRepositoryOwner = {
  avatar_url: string;
  html_url: string;
  login: string;
};

export type GitHubRepository = {
  default_branch: string;
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  forks_count: number;
  stargazers_count: number;
  open_issues_count: number;
  language: string | null;
  html_url: string;
  updated_at: string;
  watchers_count: number;
  owner: GitHubRepositoryOwner;
};

export type GitHubRepositoryBranch = {
  name: string;
  protected: boolean;
  commit: {
    sha: string;
  };
};

export type GitHubServiceErrorCode =
  | "not_found"
  | "rate_limit"
  | "network"
  | "unknown";

export class GitHubServiceError extends Error {
  readonly code: GitHubServiceErrorCode;
  readonly status?: number;

  constructor({
    code,
    message,
    status,
  }: {
    code: GitHubServiceErrorCode;
    message: string;
    status?: number;
  }) {
    super(message);
    this.name = "GitHubServiceError";
    this.code = code;
    this.status = status;
  }
}
