import { PlayerStats } from "@/models/api";
import { PlayerStatsExtended } from "@/models/stats";
import players from "@/players.mock.json";

// eslint-disable-next-line @typescript-eslint/prefer-as-const
const mock: false = false;

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

type PlayerStatsResponse = PromiseSettledResult<PlayerStatsExtended>[];

const getPlayersStatsMock = async (): Promise<PlayerStatsResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = Object.entries(players).map(([id, stats]) => ({
        status: "fulfilled" as const,
        value: { id, ...stats },
      }));
      resolve(response);
    }, 1000);
  });
};

const getPlayersStats = async (ids: string[]): Promise<PlayerStatsResponse> => {
  if (mock) return getPlayersStatsMock();
  return Promise.allSettled(
    ids.map(async (id) => {
      const stats = await getPlayerStats(id);
      return { id, ...stats };
    }),
  );
};

export const API = {
  getPlayerStats,
  getPlayersStats,
};
