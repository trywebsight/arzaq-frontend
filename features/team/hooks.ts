"use client";

import { useQuery } from "@tanstack/react-query";

import { teamMemberQuery, teamQuery } from "@/features/team/queries";
import type { TeamFilters } from "@/features/team/types";

export function useTeam(filters: TeamFilters = {}) {
  return useQuery(teamQuery(filters));
}

export function useTeamMember(idOrSlug: string) {
  return useQuery(teamMemberQuery(idOrSlug));
}
