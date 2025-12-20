"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { NullableStats, PlayerStatsExtended, Stats } from "@/models/stats";
import { TeamKey, Teams } from "@/models/team";
import type { Dispatch, FC, PropsWithChildren, SetStateAction } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const keys = {
  data: "ravionexia-data",
  teams: "ravionexia-teams",
};

type Props = PropsWithChildren;

interface Context {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  stats: NullableStats;
  setStats: (stats: PlayerStatsExtended[]) => void;
  teams: Teams;
  setPlayer: (team: TeamKey, player: PlayerStatsExtended) => void;
  removePlayer: (team: TeamKey, id: string) => void;
}

const defaultTeams: Teams = {
  A: { players: [] },
  B: { players: [] },
};

const initialValue: Context = {
  loading: false,
  setLoading: () => null,
  stats: null,
  setStats: () => null,
  teams: defaultTeams,
  setPlayer: () => null,
  removePlayer: () => null,
};

const Context = createContext<Context>(initialValue);

const DataProvider: FC<Props> = (props) => {
  const { children } = props;
  const [loading, setLoading] = useState<boolean>(initialValue.loading);
  const [stats, setStatsState] = useLocalStorage<Context["stats"]>({
    key: keys.data,
    defaultValue: initialValue.stats,
  });
  const [teams, setTeamsState] = useLocalStorage<Context["teams"]>({
    key: keys.teams,
    defaultValue: initialValue.teams,
  });

  const setStats: Context["setStats"] = useCallback(
    (data) => {
      if (data.length === 0) return;
      const mapped = data.reduce<Stats>((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
      setStatsState(mapped);
    },
    [setStatsState],
  );

  const setPlayer: Context["setPlayer"] = useCallback(
    (team, player) => {
      setTeamsState((prev) => {
        if (!prev) return prev;
        prev[team].players.push(player);
        return { ...prev };
      });
    },
    [setTeamsState],
  );

  const removePlayer: Context["removePlayer"] = useCallback(
    (team, id) => {
      setTeamsState((prev) => {
        if (!prev) return prev;
        prev[team].players = prev[team].players.filter((p) => p.id !== id);
        return { ...prev };
      });
    },
    [setTeamsState],
  );

  const exposed = useMemo(() => {
    return {
      loading,
      setLoading,
      stats,
      setStats,
      teams,
      setPlayer,
      removePlayer,
    } satisfies Context;
  }, [loading, setLoading, stats, setStats, teams, setPlayer, removePlayer]);

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useData = (): Context => useContext(Context);

export default DataProvider;
