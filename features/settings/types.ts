import type { ImageAsset } from "@/lib/assets";
import type { SocialKey } from "@/lib/site";

/** Global contact block from `GET /settings`. */
export type SettingsContact = {
  email: string;
  emailHref: string;
  phone: string;
  phoneHref: string;
  /** Digits only, no leading plus — for wa.me. */
  whatsappNumber: string;
  whatsappHref: string;
  address?: string;
};

export type SettingsSocial = {
  key: SocialKey;
  href: string;
};

export type SettingsHeroStat = {
  key: string;
  value: number;
  suffix: string;
  /** When omitted, UI uses `Hero.stats.{key}.label` from messages. */
  label?: string;
};

/**
 * `GET /settings` payload. Nullables / empty arrays mean “use lib/site + messages”.
 */
export type SiteSettings = {
  contact: SettingsContact | null;
  socials: SettingsSocial[];
  heroStats: SettingsHeroStat[];
};

export type HomeHeroContent = {
  eyebrow?: string | null;
  title?: string | null;
  image: ImageAsset | null;
  imageAlt?: string | null;
};

export type HomeAboutTeaser = {
  eyebrow?: string | null;
  title?: string | null;
  body?: string | null;
};

/**
 * `GET /home` payload. Collection data still comes from feature endpoints.
 */
export type HomeContent = {
  hero: HomeHeroContent | null;
  aboutTeaser: HomeAboutTeaser | null;
  featuredPropertyLimit: number;
  latestPostsLimit: number;
  servicesLimit: number;
  teamLimit: number;
};

/** Empty settings shape for live launch / forced empty. */
export const EMPTY_SITE_SETTINGS: SiteSettings = {
  contact: null,
  socials: [],
  heroStats: [],
};

/** Empty home shape with safe default limits. */
export const EMPTY_HOME_CONTENT: HomeContent = {
  hero: null,
  aboutTeaser: null,
  featuredPropertyLimit: 3,
  latestPostsLimit: 3,
  /** Matches the home services two-card composition. */
  servicesLimit: 2,
  teamLimit: 6,
};
