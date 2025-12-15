import type { ReplayFilter } from "@database/filters/types";
import { create } from "zustand";
import { combine } from "zustand/middleware";

import { ReplaySortOption, SortDirection } from "../replay_file_sort";
export const useReplayFilter = create(
  combine(
    {
      searchText: "",
      sortBy: ReplaySortOption.DATE,
      sortDirection: SortDirection.DESC,
      stagePlayed: 0,
      hideShortGames: true,
      characters: <number[]>[],
    },
    (set) => ({
      setSearchText: (searchText: string) => set({ searchText }),
      setSortBy: (sortBy: ReplaySortOption) => set({ sortBy }),
      setSortDirection: (sortDirection: SortDirection) => set({ sortDirection }),
      setStagePlayed: (stagePlayed: number) => set({ stagePlayed }),
      setHideShortGames: (hideShortGames: boolean) => set({ hideShortGames }),
      setCharacters: (characters: number[]) => set({ characters }),
      resetFilter: () => {
        set({
          searchText: "",
          hideShortGames: false,
          stagePlayed: 0,
          characters: [],
        });
      },
    }),
  ),
);

/**
 * Converts the current filter state to ReplayFilter array
 */
export const buildReplayFilters = (
  hideShortGames: boolean,
  searchText: string,
  stagePlayed: number,
  characters: number[],
): ReplayFilter[] => {
  const filters: ReplayFilter[] = [];
  if (hideShortGames) {
    filters.push({
      type: "duration",
      minFrames: 30 * 60, // 30 seconds
    });
  }

  if (searchText && searchText.trim() !== "") {
    filters.push({
      type: "textSearch",
      query: searchText.trim(),
    });
  }

  if (stagePlayed != 0) {
    filters.push({ type: "stage", stage: stagePlayed });
  }

  if (characters && characters.length > 0) {
    filters.push({ type: "player", characterIds: characters });
  }
  return filters;
};
