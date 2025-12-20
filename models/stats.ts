import { PlayerStats } from "./api";

export interface PlayerStatsExtended extends PlayerStats {
  id: string;
}

export type Stats = Record<string, PlayerStatsExtended>;
export type NullableStats = Stats | null;
