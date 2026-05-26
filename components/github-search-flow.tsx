"use client";

import { GitBranch, Search } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserProfileSummary } from "@/components/user-profile-summary";
import { useGitHubUserRepositories } from "@/hooks/use-github-user-repositories";
import { useGitHubUser } from "@/hooks/use-github-user";
import { getGitHubErrorMessage } from "@/services/github";

export function GitHubSearchFlow() {
  const [usernameInput, setUsernameInput] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");
  const [validationError, setValidationError] = useState("");

  const hasSubmittedUsername = submittedUsername.length > 0;
  const userQuery = useGitHubUser(submittedUsername);
  const repositoriesQuery = useGitHubUserRepositories(submittedUsername);

  const isLoading =
    hasSubmittedUsername && (userQuery.isLoading || repositoriesQuery.isLoading);

  const queryError = userQuery.error ?? repositoriesQuery.error;
  const hasQueryError =
    hasSubmittedUsername && (userQuery.isError || repositoriesQuery.isError);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedUsername = usernameInput.trim();

    if (!normalizedUsername) {
      setValidationError("Informe um usuario do GitHub para buscar.");
      setSubmittedUsername("");
      return;
    }

    setValidationError("");
    setSubmittedUsername(normalizedUsername);
    setUsernameInput(normalizedUsername);
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-7">
        <header className="flex flex-col gap-5 border-b pb-7 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-card text-foreground shadow-sm">
              <GitBranch className="size-6" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary">
                Desafio Front-End
              </p>
              <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
                Consulte repositorios do GitHub
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                Busque por um usuario para carregar o perfil publico e os
                repositorios disponiveis.
              </p>
            </div>
          </div>
        </header>

        <form
          className="grid gap-4 rounded-lg border bg-card p-5 shadow-lg shadow-black/20 sm:grid-cols-[1fr_auto] sm:items-end"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-card-foreground"
              htmlFor="github-username"
            >
              Usuario do GitHub
            </label>
            <input
              id="github-username"
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-muted-foreground/60 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20"
              onChange={(event) => setUsernameInput(event.target.value)}
              placeholder="ex: octocat"
              type="text"
              value={usernameInput}
            />
          </div>

          <Button
            className="h-11 bg-primary px-5 text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 sm:w-36"
            disabled={isLoading}
            type="submit"
          >
            <Search className="size-4" aria-hidden="true" />
            {isLoading ? "Buscando" : "Buscar"}
          </Button>
        </form>

        {validationError ? (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-red-200">
            {validationError}
          </p>
        ) : null}

        {!hasSubmittedUsername && !validationError ? (
          <section className="rounded-lg border border-dashed bg-card/70 p-6 text-sm leading-6 text-muted-foreground">
            Informe um username para iniciar a consulta. A busca usa a API
            publica do GitHub e carrega perfil e repositorios juntos.
          </section>
        ) : null}

        {isLoading ? (
          <section className="rounded-lg border bg-card p-6 text-sm text-muted-foreground shadow-lg shadow-black/20">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-primary" />
              Carregando dados do GitHub...
            </div>
          </section>
        ) : null}

        {hasQueryError ? (
          <section className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-sm text-red-200">
            {getGitHubErrorMessage(queryError)}
          </section>
        ) : null}

        {userQuery.data && repositoriesQuery.data && !hasQueryError ? (
          <UserProfileSummary
            repositoriesCount={repositoriesQuery.data.length}
            user={userQuery.data}
          />
        ) : null}
      </section>
    </main>
  );
}
