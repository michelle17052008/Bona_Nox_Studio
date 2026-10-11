import { queryOptions } from "@tanstack/react-query";
import { listWorks } from "./content-public.functions";

export type WorkRow = {
  id: string;
  title: string;
  caption: string;
  category: string;
  subcategory?: string | null;
  image_url: string;
  gallery_urls: string[];
  position: number;
};

export const worksQuery = queryOptions({
  queryKey: ["works"],
  queryFn: () => listWorks() as Promise<WorkRow[]>,
});