"use client";

import { useData } from "@/providers/data";
import { FC } from "react";
import FetchedStatsItem from "./fetched-stats-item";

const FetchedStats: FC = () => {
  const { loading, stats: statsRaw } = useData();
  const stats = statsRaw ? Object.keys(statsRaw) : [];
  return (
    <div className="grid w-full max-w-5xl grid-cols-2 gap-4">
      {loading && <p>Loading...</p>}
      {!loading && stats.length === 0 && <p>No stats found</p>}
      {!loading &&
        stats.length > 0 &&
        stats.map((id) => <FetchedStatsItem key={id} id={id} />)}
    </div>
  );
};

export default FetchedStats;
