import { queryOptions } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/keys";
import { fetchTeam, fetchTeamMember } from "@/features/team/api";
import type { TeamFilters } from "@/features/team/types";

export const teamQuery = (filters: TeamFilters = {}) =>
  queryOptions({
    queryKey: queryKeys.team.list(filters),
    queryFn: ({ signal }) => fetchTeam(filters, signal),
  });

export const teamMemberQuery = (idOrSlug: string) =>
  queryOptions({
    queryKey: queryKeys.team.detail(idOrSlug),
    queryFn: ({ signal }) => fetchTeamMember(idOrSlug, signal),
  });
