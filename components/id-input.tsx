"use client";

import { PlayerStatsExtended } from "@/models/stats";
import { useData } from "@/providers/data";
import { Button } from "@/ui/button";
import { Textarea } from "@/ui/textarea";
import { API } from "@/utils/api";
import { FC, FormEvent, FormEventHandler } from "react";

interface Form extends HTMLFormControlsCollection {
  ids: { value: string };
}

const getIds = (e: FormEvent<HTMLFormElement>) => {
  const form = e.currentTarget;
  const elements = form.elements as Form;
  const value = elements?.ids.value.trim();

  const regex = /[a-zA-Z0-9\u0400-\u04FF]+-\d+/g;
  const matches = value.match(regex);
  return matches ? matches : [];
};

const IDInput: FC = () => {
  const { loading, setLoading, setStats } = useData();

  const handleSumbit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const ids = getIds(e);
    console.info("ids", ids);
    if (ids.length === 0) return;
    setLoading(true);
    API.getPlayersStats(ids)
      .then((res) => {
        const response = res.reduce<PlayerStatsExtended[]>((acc, item) => {
          if (item.status === "rejected") return acc;
          acc.push(item.value);
          return acc;
        }, []);
        setStats(response);
      })
      .catch(() => {
        console.error("error fetching stats");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form className="w-full max-w-2xl" onSubmit={handleSumbit}>
      <Textarea id="ids" placeholder="Enter IDs here..." />
      <Button className="mt-2 w-full" type="submit" disabled={loading}>
        Submit
      </Button>
    </form>
  );
};

export default IDInput;
