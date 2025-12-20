"use client";

import DataProvider from "@/providers/data";
import type { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren;

const RootProviders: FC<Props> = (props) => {
  const { children } = props;
  return <DataProvider>{children}</DataProvider>;
};

export default RootProviders;
