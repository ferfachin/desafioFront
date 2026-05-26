import { RepositoryDetails } from "@/components/repository-details";

type RepositoryDetailsPageProps = {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
  searchParams: Promise<{
    from?: string;
  }>;
};

export default async function RepositoryDetailsPage({
  params,
  searchParams,
}: RepositoryDetailsPageProps) {
  const { owner, repo } = await params;
  const { from } = await searchParams;

  return <RepositoryDetails from={from} owner={owner} repo={repo} />;
}
