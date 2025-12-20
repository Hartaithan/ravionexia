import { PlayerStatsExtended } from "./stats";

export interface Team {
  players: PlayerStatsExtended[];
}

export type TeamKey = "A" | "B";
export type Teams = Record<TeamKey, Team>;
export type NullableTeams = Teams | null;
