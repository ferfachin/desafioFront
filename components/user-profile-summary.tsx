import { ExternalLink, FileText, GitBranch, Mail, UserPlus, Users } from "lucide-react";
import Image from "next/image";
import type { GitHubUser } from "@/types/github";

type UserProfileSummaryProps = {
  repositoriesCount: number;
  user: GitHubUser;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function UserProfileSummary({
  repositoriesCount,
  user,
}: UserProfileSummaryProps) {
  const displayName = user.name ?? user.login;
  const email = user.email ?? "Nao informado";
  const bio = user.bio ?? "Sem bio cadastrada";

  return (
    <section className="grid gap-5 rounded-lg border bg-card p-5 shadow-lg shadow-black/20 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row">
        <Image
          alt={`Avatar de ${displayName}`}
          className="size-24 rounded-lg border object-cover shadow-md shadow-black/20 sm:size-28"
          height={112}
          src={user.avatar_url}
          width={112}
        />

        <div className="min-w-0 flex-1 space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-primary">@{user.login}</p>
            <h2 className="break-words text-2xl font-semibold text-card-foreground">
              {displayName}
            </h2>
          </div>

          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            {bio}
          </p>

          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-primary" aria-hidden="true" />
              <span className="min-w-0 truncate">{email}</span>
            </div>
            <a
              className="inline-flex items-center gap-2 text-primary transition-colors hover:text-primary/80"
              href={user.html_url}
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              Ver perfil no GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border bg-background/60 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="size-4 text-primary" aria-hidden="true" />
            Seguidores
          </div>
          <p className="mt-2 text-2xl font-semibold">
            {formatNumber(user.followers)}
          </p>
        </div>

        <div className="rounded-lg border bg-background/60 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserPlus className="size-4 text-primary" aria-hidden="true" />
            Seguindo
          </div>
          <p className="mt-2 text-2xl font-semibold">
            {formatNumber(user.following)}
          </p>
        </div>

        <div className="rounded-lg border bg-background/60 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GitBranch className="size-4 text-primary" aria-hidden="true" />
            Repositorios
          </div>
          <p className="mt-2 text-2xl font-semibold">
            {formatNumber(repositoriesCount)}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg border bg-background/40 p-4 text-sm text-muted-foreground">
        <FileText className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <p>
          Perfil carregado com os dados publicos retornados pela API do GitHub.
        </p>
      </div>
    </section>
  );
}
