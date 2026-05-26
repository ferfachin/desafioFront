import axios from "axios";

export const githubApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GITHUB_API_URL ?? "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
  },
});
