import { PlayerStats } from "@/models/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const statuses: Record<number, string> = {
  504: "The server took too long to respond. Please try again later",
};

const handleResponse = async (response: Response) => {
  if (statuses[response.status]) throw new Error(statuses[response.status]);
  const data = await response.json();
  if (!response.ok) throw new Error(data?.message ?? "Unknown error");
  return data;
};

const getPlayerStats = async (id: string): Promise<PlayerStats> => {
  const url = new URL(`/players/${id}/stats/career`, API_URL);
  url.searchParams.append("hero", "all-heroes");
  url.searchParams.append("platform", "console");
  url.searchParams.append("gamemode", "quickplay");
  const response = await fetch(url.toString());
  return await handleResponse(response);
};

const getPlayersStats = async (
  ids: string[],
): Promise<PromiseSettledResult<PlayerStats>[]> => {
  return Promise.allSettled(ids.map((id) => getPlayerStats(id)));
};

export const API = {
  getPlayerStats,
  getPlayersStats,
};
