import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { TeamFilters, TeamMember } from "@/features/team/types";

/** GET /team */
export function fetchTeam(
  filters: TeamFilters = {},
  signal?: AbortSignal,
): Promise<TeamMember[]> {
  return apiFetch<TeamMember[]>(endpoints.team, {
    signal,
    searchParams: { limit: filters.limit },
  });
}

/** GET /team/:idOrSlug — resolves to `null` when not found. */
export function fetchTeamMember(
  idOrSlug: string,
  signal?: AbortSignal,
): Promise<TeamMember | null> {
  return apiFetch<TeamMember | null>(endpoints.teamMember(idOrSlug), {
    signal,
    nullOn404: true,
  });
}
