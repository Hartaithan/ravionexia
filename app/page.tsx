import FetchedStats from "@/components/fetched-stats";
import IDInput from "@/components/id-input";
import Teams from "@/components/teams";
import { FC } from "react";

const HomePage: FC = () => {
  return (
    <div className="container mx-auto flex flex-col items-center gap-y-4 py-12">
      <IDInput />
      <FetchedStats />
      <Teams />
    </div>
  );
};

export default HomePage;
