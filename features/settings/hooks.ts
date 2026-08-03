"use client";

import { useQuery } from "@tanstack/react-query";

import {
  homeContentQuery,
  settingsQuery,
} from "@/features/settings/queries";

/** Client hook for `GET /settings`. */
export function useSettings() {
  return useQuery(settingsQuery());
}

/** Client hook for `GET /home`. */
export function useHomeContent() {
  return useQuery(homeContentQuery());
}
