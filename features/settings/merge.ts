import type { ImageAsset } from "@/lib/assets";
import { assets } from "@/lib/assets";
import {
  CONTACT,
  HERO_STATS,
  SOCIAL_LINKS,
  type HeroStat,
  type SocialKey,
  type SocialLink,
} from "@/lib/site";
import type {
  HomeAboutTeaser,
  HomeContent,
  HomeHeroContent,
  SettingsHeroStat,
  SiteSettings,
} from "@/features/settings/types";
import { EMPTY_HOME_CONTENT } from "@/features/settings/types";

const SOCIAL_KEYS = new Set<SocialKey>(["instagram", "whatsapp", "x"]);

/** Contact shape used by footer, JSON-LD, and legal fallbacks. */
export type ResolvedContact = {
  email: string;
  emailHref: string;
  phone: string;
  phoneHref: string;
  whatsappNumber: string;
  whatsappHref: string;
  /** Optional CMS address; UI may still prefer messages when absent. */
  address?: string;
};

/** Hero stat ready for CountUp + label resolution in the UI. */
export type ResolvedHeroStat = {
  key: string;
  value: number;
  suffix: string;
  /** CMS label; when omitted, UI reads `Hero.stats.{key}.label`. */
  label?: string;
};

export type ResolvedHomeHero = {
  eyebrow: string | null;
  title: string | null;
  image: ImageAsset;
  imageAlt: string | null;
};

export type ResolvedHomeAbout = {
  eyebrow: string | null;
  title: string | null;
  body: string | null;
};

export type ResolvedHomeLimits = {
  featuredPropertyLimit: number;
  latestPostsLimit: number;
  servicesLimit: number;
  teamLimit: number;
};

function isSocialKey(value: string): value is SocialKey {
  return SOCIAL_KEYS.has(value as SocialKey);
}

/**
 * Merge `GET /settings` contact over `lib/site` CONTACT.
 * Null / missing contact → static fallback.
 *
 * @example
 * const contact = resolveContact(settings);
 */
export function resolveContact(
  settings?: SiteSettings | null,
): ResolvedContact {
  const fromApi = settings?.contact;
  if (!fromApi) {
    return {
      email: CONTACT.email,
      emailHref: CONTACT.emailHref,
      phone: CONTACT.phone,
      phoneHref: CONTACT.phoneHref,
      whatsappNumber: CONTACT.whatsappNumber,
      whatsappHref: CONTACT.whatsappHref,
    };
  }

  return {
    email: fromApi.email || CONTACT.email,
    emailHref: fromApi.emailHref || CONTACT.emailHref,
    phone: fromApi.phone || CONTACT.phone,
    phoneHref: fromApi.phoneHref || CONTACT.phoneHref,
    whatsappNumber: fromApi.whatsappNumber || CONTACT.whatsappNumber,
    whatsappHref: fromApi.whatsappHref || CONTACT.whatsappHref,
    ...(fromApi.address ? { address: fromApi.address } : {}),
  };
}

/**
 * Merge `GET /settings` socials over `SOCIAL_LINKS`. Empty array → fallback.
 *
 * @example
 * const socials = resolveSocials(settings);
 */
export function resolveSocials(
  settings?: SiteSettings | null,
): readonly SocialLink[] {
  const fromApi = settings?.socials;
  if (!fromApi?.length) return SOCIAL_LINKS;

  const filtered = fromApi.filter((item) => isSocialKey(item.key) && item.href);
  return filtered.length > 0
    ? filtered.map((item) => ({ key: item.key as SocialKey, href: item.href }))
    : SOCIAL_LINKS;
}

function toResolvedStat(stat: SettingsHeroStat | HeroStat): ResolvedHeroStat {
  return {
    key: stat.key,
    value: stat.value,
    suffix: stat.suffix,
    ...("label" in stat && stat.label ? { label: stat.label } : {}),
  };
}

/**
 * Merge `GET /settings` heroStats over `HERO_STATS`. Empty → fallback.
 *
 * @example
 * const stats = resolveHeroStats(settings);
 */
export function resolveHeroStats(
  settings?: SiteSettings | null,
): readonly ResolvedHeroStat[] {
  const fromApi = settings?.heroStats;
  if (!fromApi?.length) {
    return HERO_STATS.map(toResolvedStat);
  }
  return fromApi.map(toResolvedStat);
}

/**
 * Home hero CMS fields over static assets / messages (null → keep message).
 */
export function resolveHomeHero(
  home?: HomeContent | null,
): ResolvedHomeHero {
  const hero: HomeHeroContent | null = home?.hero ?? null;
  return {
    eyebrow: hero?.eyebrow?.trim() ? hero.eyebrow : null,
    title: hero?.title?.trim() ? hero.title : null,
    image: hero?.image?.src ? hero.image : assets.hero,
    imageAlt: hero?.imageAlt?.trim()
      ? hero.imageAlt
      : hero?.image?.alt?.trim()
        ? hero.image.alt
        : null,
  };
}

/**
 * Home about teaser CMS fields. Null strings → keep `About.*` messages.
 */
export function resolveHomeAbout(
  home?: HomeContent | null,
): ResolvedHomeAbout {
  const teaser: HomeAboutTeaser | null = home?.aboutTeaser ?? null;
  return {
    eyebrow: teaser?.eyebrow?.trim() ? teaser.eyebrow : null,
    title: teaser?.title?.trim() ? teaser.title : null,
    body: teaser?.body?.trim() ? teaser.body : null,
  };
}

/**
 * Section limits from `GET /home`, with safe defaults matching empty CMS.
 * Services default stays at 2 to match the home two-card composition.
 */
export function resolveHomeLimits(
  home?: HomeContent | null,
): ResolvedHomeLimits {
  const source = home ?? EMPTY_HOME_CONTENT;
  return {
    featuredPropertyLimit: positiveLimit(
      source.featuredPropertyLimit,
      EMPTY_HOME_CONTENT.featuredPropertyLimit,
    ),
    latestPostsLimit: positiveLimit(
      source.latestPostsLimit,
      EMPTY_HOME_CONTENT.latestPostsLimit,
    ),
    servicesLimit: positiveLimit(
      source.servicesLimit,
      EMPTY_HOME_CONTENT.servicesLimit,
    ),
    teamLimit: positiveLimit(source.teamLimit, EMPTY_HOME_CONTENT.teamLimit),
  };
}

function positiveLimit(value: number | undefined, fallback: number): number {
  return Number.isFinite(value) && (value as number) > 0
    ? Math.floor(value as number)
    : fallback;
}
