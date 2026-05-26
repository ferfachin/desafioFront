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
  login: string;
};

export type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  updated_at: string;
  owner: GitHubRepositoryOwner;
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
