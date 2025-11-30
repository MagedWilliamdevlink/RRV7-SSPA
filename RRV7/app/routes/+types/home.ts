import type { LoaderFunctionArgs } from "react-router";

export interface LoaderData {
  services: Array<{
    name: string;
    route: string;
  }>;
}

export type LoaderFunction = (args: LoaderFunctionArgs) => Promise<LoaderData>;