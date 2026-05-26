"use client";

import { CalendarDays, ChevronLeft, ChevronRight, Code, GitBranch, Star } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { GitHubRepository } from "@/types/github";

type RepositoryListProps = {
  repositories: GitHubRepository[];
};

type RepositorySortOption =
  | "stars-desc"
  | "stars-asc"
  | "name-asc"
  | "name-desc"
  | "updated-desc";

const sortLabels: Record<RepositorySortOption, string> = {
  "stars-desc": "Estrelas: maior para menor",
  "stars-asc": "Estrelas: menor para maior",
  "name-asc": "Nome: A-Z",
  "name-desc": "Nome: Z-A",
  "updated-desc": "Atualizados recentemente",
};

const repositoriesPerPage = 8;

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function sortRepositories(
  repositories: GitHubRepository[],
  sortOption: RepositorySortOption,
) {
  return [...repositories].sort((first, second) => {
    if (sortOption === "stars-desc") {
      return second.stargazers_count - first.stargazers_count;
    }

    if (sortOption === "stars-asc") {
      return first.stargazers_count - second.stargazers_count;
    }

    if (sortOption === "name-asc") {
      return first.name.localeCompare(second.name);
    }

    if (sortOption === "name-desc") {
      return second.name.localeCompare(first.name);
    }

    return (
      new Date(second.updated_at).getTime() - new Date(first.updated_at).getTime()
    );
  });
}

export function RepositoryList({ repositories }: RepositoryListProps) {
  const [sortOption, setSortOption] =
    useState<RepositorySortOption>("stars-desc");
  const [currentPage, setCurrentPage] = useState(1);

  const sortedRepositories = useMemo(
    () => sortRepositories(repositories, sortOption),
    [repositories, sortOption],
  );

  const totalPages = Math.ceil(sortedRepositories.length / repositoriesPerPage);
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));
  const firstRepositoryIndex = (safeCurrentPage - 1) * repositoriesPerPage;
  const paginatedRepositories = sortedRepositories.slice(
    firstRepositoryIndex,
    firstRepositoryIndex + repositoriesPerPage,
  );
  const firstVisibleRepository = firstRepositoryIndex + 1;
  const lastVisibleRepository = Math.min(
    firstRepositoryIndex + repositoriesPerPage,
    sortedRepositories.length,
  );

  function handleSortChange(value: RepositorySortOption) {
    setSortOption(value);
    setCurrentPage(1);
  }

  if (repositories.length === 0) {
    return (
      <section className="rounded-lg border border-dashed bg-card/70 p-6 text-sm leading-6 text-muted-foreground">
        Este usuario nao possui repositorios publicos para listar.
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Repositorios</p>
          <h2 className="mt-1 text-2xl font-semibold">
            Projetos encontrados
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Exibindo {firstVisibleRepository}-{lastVisibleRepository} de{" "}
            {formatNumber(sortedRepositories.length)}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="repository-sort">
            Ordenar por
          </label>
          <select
            className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors hover:border-muted-foreground/60 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 sm:w-64"
            id="repository-sort"
            onChange={(event) =>
              handleSortChange(event.target.value as RepositorySortOption)
            }
            value={sortOption}
          >
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3">
        {paginatedRepositories.map((repository) => {
          const owner = encodeURIComponent(repository.owner.login);
          const repo = encodeURIComponent(repository.name);

          return (
            <Link
              className="group rounded-lg border bg-card p-5 shadow-lg shadow-black/10 transition-colors hover:border-primary/70 hover:bg-accent/50 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20"
              href={`/repos/${owner}/${repo}`}
              key={repository.id}
            >
              <article className="grid gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-2">
                    <h3 className="break-words text-lg font-semibold text-card-foreground transition-colors group-hover:text-primary">
                      {repository.name}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {repository.description ?? "Sem descricao"}
                    </p>
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-md border bg-background/60 px-3 py-1.5 text-sm">
                    <Star
                      className="size-4 fill-primary text-primary"
                      aria-hidden="true"
                    />
                    {formatNumber(repository.stargazers_count)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Code className="size-4 text-primary" aria-hidden="true" />
                    {repository.language ?? "Nao informada"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />
                    Atualizado em{" "}
                    {new Intl.DateTimeFormat("pt-BR").format(
                      new Date(repository.updated_at),
                    )}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <GitBranch
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />
                    {repository.full_name}
                  </span>
                </div>
              </article>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 ? (
        <nav
          aria-label="Paginacao de repositorios"
          className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-muted-foreground">
            Pagina {safeCurrentPage} de {totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              className="h-9"
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              type="button"
              variant="outline"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Anterior
            </Button>
            <Button
              className="h-9"
              disabled={safeCurrentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              type="button"
              variant="outline"
            >
              Proxima
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </nav>
      ) : null}
    </section>
  );
}
