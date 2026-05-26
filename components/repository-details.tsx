"use client";

import {
  ArrowLeft,
  CalendarDays,
  Code,
  ExternalLink,
  GitBranch,
  GitFork,
  GitPullRequest,
  Star,
  User,
  Watch,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useGitHubRepositoryBranches } from "@/hooks/use-github-repository-branches";
import { useGitHubRepository } from "@/hooks/use-github-repository";
import { getGitHubErrorMessage } from "@/services/github";

type RepositoryDetailsProps = {
  from?: string;
  owner: string;
  repo: string;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
}

export function RepositoryDetails({ from, owner, repo }: RepositoryDetailsProps) {
  const repositoryQuery = useGitHubRepository(owner, repo);
  const branchesQuery = useGitHubRepositoryBranches(owner, repo);
  const backHref = from?.startsWith("/?username=") ? from : "/";
  const isLoading = repositoryQuery.isLoading || branchesQuery.isLoading;
  const queryError = repositoryQuery.error ?? branchesQuery.error;
  const hasQueryError = repositoryQuery.isError || branchesQuery.isError;

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto grid w-full max-w-4xl gap-6">
        <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20"
            href={backHref}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar para busca
          </Link>
        </header>

        {isLoading ? (
          <section className="rounded-lg border bg-card p-6 text-sm text-muted-foreground shadow-lg shadow-black/20">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-primary" aria-hidden="true" />
              Carregando detalhes do repositorio...
            </div>
          </section>
        ) : null}

        {hasQueryError ? (
          <section
            className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-sm text-red-200"
            role="alert"
          >
            {getGitHubErrorMessage(queryError)}
          </section>
        ) : null}

        {repositoryQuery.data ? (
          <article className="grid gap-6 rounded-lg border bg-card p-5 shadow-lg shadow-black/20 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-2">
                <p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  <GitBranch className="size-4" aria-hidden="true" />
                  {repositoryQuery.data.full_name}
                </p>
                <h1 className="break-words text-3xl font-semibold tracking-normal">
                  {repositoryQuery.data.name}
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                  {repositoryQuery.data.description ?? "Sem descricao"}
                </p>
              </div>

              <a
                className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20"
                href={repositoryQuery.data.html_url}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
                GitHub
              </a>
            </div>

            <div className="flex flex-col gap-4 rounded-lg border bg-background/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Image
                  alt={`Avatar de ${repositoryQuery.data.owner.login}`}
                  className="size-12 rounded-lg border object-cover"
                  height={48}
                  src={repositoryQuery.data.owner.avatar_url}
                  width={48}
                />
                <div>
                  <p className="text-sm text-muted-foreground">Pertence a</p>
                  <p className="font-semibold">
                    {repositoryQuery.data.owner.login}
                  </p>
                </div>
              </div>
              <a
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20"
                href={repositoryQuery.data.owner.html_url}
                rel="noreferrer"
                target="_blank"
              >
                <User className="size-4" aria-hidden="true" />
                Ver dono no GitHub
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border bg-background/60 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
                  Estrelas
                </div>
                <p className="mt-2 text-2xl font-semibold">
                  {formatNumber(repositoryQuery.data.stargazers_count)}
                </p>
              </div>

              <div className="rounded-lg border bg-background/60 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Code className="size-4 text-primary" aria-hidden="true" />
                  Linguagem
                </div>
                <p className="mt-2 text-xl font-semibold">
                  {repositoryQuery.data.language ?? "Nao informada"}
                </p>
              </div>

              <div className="rounded-lg border bg-background/60 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="size-4 text-primary" aria-hidden="true" />
                  Atualizado em
                </div>
                <p className="mt-2 text-xl font-semibold">
                  {formatDate(repositoryQuery.data.updated_at)}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-background/60 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GitBranch className="size-4 text-primary" aria-hidden="true" />
                  Branch padrao
                </div>
                <p className="mt-2 truncate text-lg font-semibold">
                  {repositoryQuery.data.default_branch}
                </p>
              </div>

              <div className="rounded-lg border bg-background/60 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GitFork className="size-4 text-primary" aria-hidden="true" />
                  Forks
                </div>
                <p className="mt-2 text-lg font-semibold">
                  {formatNumber(repositoryQuery.data.forks_count)}
                </p>
              </div>

              <div className="rounded-lg border bg-background/60 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Watch className="size-4 text-primary" aria-hidden="true" />
                  Watchers
                </div>
                <p className="mt-2 text-lg font-semibold">
                  {formatNumber(repositoryQuery.data.watchers_count)}
                </p>
              </div>

              <div className="rounded-lg border bg-background/60 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GitPullRequest
                    className="size-4 text-primary"
                    aria-hidden="true"
                  />
                  Issues abertas
                </div>
                <p className="mt-2 text-lg font-semibold">
                  {formatNumber(repositoryQuery.data.open_issues_count)}
                </p>
              </div>
            </div>

            <section className="grid gap-3 rounded-lg border bg-background/40 p-4">
              <div>
                <p className="text-sm font-medium text-primary">Branches</p>
                <h2 className="mt-1 text-xl font-semibold">
                  Branches principais
                </h2>
              </div>

              {branchesQuery.data && branchesQuery.data.length > 0 ? (
                <div className="grid gap-2">
                  {branchesQuery.data.map((branch) => (
                    <div
                      className="flex flex-col gap-2 rounded-md border bg-card px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                      key={branch.name}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{branch.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          SHA {branch.commit.sha}
                        </p>
                      </div>
                      <span className="w-fit rounded-sm border bg-background/60 px-2 py-1 text-xs text-muted-foreground">
                        {branch.protected ? "Protegida" : "Aberta"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhuma branch publica encontrada.
                </p>
              )}
            </section>
          </article>
        ) : null}
      </section>
    </main>
  );
}
