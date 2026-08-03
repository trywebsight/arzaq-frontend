export { fetchSettings, fetchHomeContent } from "@/features/settings/api";
export {
  settingsQuery,
  homeContentQuery,
} from "@/features/settings/queries";
export { useSettings, useHomeContent } from "@/features/settings/hooks";
export {
  resolveContact,
  resolveSocials,
  resolveHeroStats,
  resolveHomeHero,
  resolveHomeAbout,
  resolveHomeLimits,
} from "@/features/settings/merge";
export {
  getSiteSettings,
  getHomeContent,
} from "@/features/settings/server";
export type {
  SiteSettings,
  HomeContent,
  SettingsContact,
  SettingsHeroStat,
  SettingsSocial,
  HomeHeroContent,
  HomeAboutTeaser,
} from "@/features/settings/types";
export {
  EMPTY_SITE_SETTINGS,
  EMPTY_HOME_CONTENT,
} from "@/features/settings/types";
