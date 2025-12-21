"use client";

import { useData } from "@/providers/data";
import { Card } from "@/ui/card";
import { getWinRate } from "@/utils/stats";
import { cn } from "@/utils/styles";
import { formatTime } from "@/utils/time";
import { IconUser } from "@tabler/icons-react";
import { FC, PropsWithChildren } from "react";

interface ItemProps extends PropsWithChildren {
  label: string;
  color?: string;
}

const StatItem: FC<ItemProps> = (props) => {
  const { label, color, children } = props;
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground">{label}</p>
      <p className={cn("font-semibold", color)}>{children}</p>
    </div>
  );
};

interface Props {
  id: string;
}

const FetchedStatsItem: FC<Props> = (props) => {
  const { stats } = useData();
  const { id } = props;
  const item = stats?.[id] || null;
  if (!item) return <p>Not Found</p>;

  const rate = getWinRate(
    item["all-heroes"].game.games_won,
    item["all-heroes"].game.games_played,
  );

  return (
    <Card className="gap-2 p-3">
      <div className="flex items-center gap-2">
        <IconUser className="size-4" />
        <p className="font-bold">{item.id}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <StatItem label="Hero Wins">
          {item["all-heroes"].game.hero_wins}
        </StatItem>
        <StatItem label="Time Played">
          {formatTime(item["all-heroes"].game.time_played)}
        </StatItem>
        <StatItem label="Games Played">
          {item["all-heroes"].game.games_played}
        </StatItem>
        <StatItem label="Win Rate" color="text-chart-2">
          {rate}%
        </StatItem>
        <StatItem label="Wins" color="text-green-400">
          {item["all-heroes"].game.games_won}
        </StatItem>
        <StatItem label="Losses" color="text-red-400">
          {item["all-heroes"].game.games_lost}
        </StatItem>
      </div>
    </Card>
  );
};

export default FetchedStatsItem;
