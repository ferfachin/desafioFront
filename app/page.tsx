import { GitHubSearchFlow } from "@/components/github-search-flow";

type HomeProps = {
  searchParams: Promise<{
    username?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { username } = await searchParams;

  return <GitHubSearchFlow initialUsername={username} />;
}
