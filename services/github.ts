import { AxiosError } from "axios";
import { githubApi } from "@/lib/github-api";
import { GitHubServiceError } from "@/types/github";
import type {
  GitHubRepository,
  GitHubRepositoryBranch,
  GitHubUser,
} from "@/types/github";

function normalizeGitHubError(error: unknown): GitHubServiceError {
  if (error instanceof AxiosError) {
    const status = error.response?.status;

    if (status === 404) {
      return new GitHubServiceError({
        code: "not_found",
        message: "Recurso nao encontrado no GitHub.",
        status,
      });
    }

    if (status === 403 || status === 429) {
      return new GitHubServiceError({
        code: "rate_limit",
        message: "Limite de requisicoes da API do GitHub atingido.",
        status,
      });
    }

    if (!error.response) {
      return new GitHubServiceError({
        code: "network",
        message: "Nao foi possivel conectar a API do GitHub.",
      });
    }

    return new GitHubServiceError({
      code: "unknown",
      message: "Nao foi possivel carregar os dados do GitHub.",
      status,
    });
  }

  return new GitHubServiceError({
    code: "unknown",
    message: "Ocorreu um erro inesperado ao consultar o GitHub.",
  });
}

function encodePathSegment(value: string) {
  return encodeURIComponent(value.trim());
}

export async function getGitHubUser(username: string): Promise<GitHubUser> {
  try {
    const { data } = await githubApi.get<GitHubUser>(
      `/users/${encodePathSegment(username)}`,
    );

    return data;
  } catch (error) {
    throw normalizeGitHubError(error);
  }
}

export async function getGitHubUserRepositories(
  username: string,
): Promise<GitHubRepository[]> {
  try {
    const { data } = await githubApi.get<GitHubRepository[]>(
      `/users/${encodePathSegment(username)}/repos`,
      {
        params: {
          per_page: 100,
        },
      },
    );

    return data;
  } catch (error) {
    throw normalizeGitHubError(error);
  }
}

export async function getGitHubRepository(
  owner: string,
  repo: string,
): Promise<GitHubRepository> {
  try {
    const { data } = await githubApi.get<GitHubRepository>(
      `/repos/${encodePathSegment(owner)}/${encodePathSegment(repo)}`,
    );

    return data;
  } catch (error) {
    throw normalizeGitHubError(error);
  }
}

export async function getGitHubRepositoryBranches(
  owner: string,
  repo: string,
): Promise<GitHubRepositoryBranch[]> {
  try {
    const { data } = await githubApi.get<GitHubRepositoryBranch[]>(
      `/repos/${encodePathSegment(owner)}/${encodePathSegment(repo)}/branches`,
      {
        params: {
          per_page: 10,
        },
      },
    );

    return data;
  } catch (error) {
    throw normalizeGitHubError(error);
  }
}

export function getGitHubErrorMessage(error: unknown): string {
  if (error instanceof GitHubServiceError) {
    return error.message;
  }

  return "Nao foi possivel carregar os dados do GitHub.";
}
