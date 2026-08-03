/**
 * Structural site data: everything that is *not* copy.
 *
 * Copy lives in `messages/ar.json`. This module owns the ordering, hrefs,
 * anchors and raw numbers that the copy is attached to, so that sections stay
 * data-driven instead of hardcoding lists in JSX.
 */

export const siteConfig = {
  /** Absolute origin. Override in production via `NEXT_PUBLIC_SITE_URL`. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://arzaq.com.kw",
  locale: "ar",
  ogLocale: "ar_KW",
  direction: "rtl",
} as const;

/** Anchor ids used by the in-page navigation. Sections must render these. */
export const SECTION_IDS = {
  hero: "hero",
  about: "about",
  properties: "properties",
  services: "services",
  team: "team",
  blog: "blog",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

export type NavItem = {
  /** Message key under the `Nav.items` namespace. */
  key: "home" | "about" | "properties" | "services" | "team" | "blog";
  href: string;
  /** Section id observed for the active state, when the link is in-page. */
  sectionId?: SectionId;
};

/** Ordered primary navigation. Labels: `t("items." + item.key)` in `Nav`. */
export const NAV_ITEMS: readonly NavItem[] = [
  { key: "home", href: "/", sectionId: SECTION_IDS.hero },
  { key: "about", href: "/about", sectionId: SECTION_IDS.about },
  { key: "properties", href: "/properties", sectionId: SECTION_IDS.properties },
  { key: "services", href: "/services", sectionId: SECTION_IDS.services },
  { key: "team", href: "/team", sectionId: SECTION_IDS.team },
  { key: "blog", href: "/blog", sectionId: SECTION_IDS.blog },
] as const;

/** App paths used by CTAs and footer links (not in-page section anchors). */
export const ROUTES = {
  contact: "/contact",
  contactFaq: "/contact#faq",
} as const;

export type FooterLinkItem =
  | {
      /** Label: `Nav.items.${key}`. */
      source: "nav";
      key: NavItem["key"];
      href: string;
    }
  | {
      /** Label: `Footer.links.${key}`. */
      source: "footer";
      key: "contact" | "faq";
      href: string;
    };

/**
 * Footer link columns with distinct title keys under `Footer.*`.
 * Column A: home / about / properties / contact ·
 * Column B: services / team / blog / faq.
 */
export const FOOTER_LINK_COLUMNS: readonly {
  titleKey: "linksTitlePrimary" | "linksTitleSecondary";
  items: readonly FooterLinkItem[];
}[] = [
  {
    titleKey: "linksTitlePrimary",
    items: [
      { source: "nav", key: "home", href: NAV_ITEMS[0].href },
      { source: "nav", key: "about", href: NAV_ITEMS[1].href },
      { source: "nav", key: "properties", href: NAV_ITEMS[2].href },
      { source: "footer", key: "contact", href: ROUTES.contact },
    ],
  },
  {
    titleKey: "linksTitleSecondary",
    items: [
      { source: "nav", key: "services", href: NAV_ITEMS[3].href },
      { source: "nav", key: "team", href: NAV_ITEMS[4].href },
      { source: "nav", key: "blog", href: NAV_ITEMS[5].href },
      { source: "footer", key: "faq", href: ROUTES.contactFaq },
    ],
  },
];

export type HeroStat = {
  /** Message key under `Hero.stats`, e.g. `Hero.stats.years.label`. */
  key: "years" | "sales" | "homes";
  /** Target number for `CountUp`. */
  value: number;
  /** Rendered immediately after the number. Safe in RTL (bidi number run). */
  suffix: string;
};

/** Ordered hero statistics. Labels: `t("stats." + stat.key + ".label")`. */
export const HERO_STATS: readonly HeroStat[] = [
  { key: "years", value: 15, suffix: "+" },
  { key: "sales", value: 100, suffix: "+" },
  { key: "homes", value: 600, suffix: "+" },
] as const;

/** Contact endpoints. Display strings that need translating live in messages. */
export const CONTACT = {
  email: "email@example.com",
  emailHref: "mailto:email@example.com",
  /** Display form, Western digits per Gulf convention. */
  phone: "(+965) 555-5555",
  phoneHref: "tel:+9655555555",
  /** E.164 without the leading plus, as wa.me expects. */
  whatsappNumber: "9655555555",
  whatsappHref: "https://wa.me/9655555555",
} as const;

export type SocialKey = "instagram" | "whatsapp" | "x";

export type SocialLink = {
  /** Message key under `Footer.socials`. */
  key: SocialKey;
  href: string;
};

/** Ordered social links. Pick the icon in the consuming component. */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  { key: "instagram", href: "https://instagram.com/arzaq" },
  { key: "whatsapp", href: CONTACT.whatsappHref },
  { key: "x", href: "https://x.com/arzaq" },
] as const;

/** Legal links rendered in the footer bottom row. */
export const LEGAL_LINKS = [
  { key: "privacy", href: "/privacy" },
  { key: "terms", href: "/terms" },
] as const;

/**
 * Build a prefilled WhatsApp deep link.
 *
 * @param message - Plain text, encoded for you.
 */
export function whatsappLink(message?: string): string {
  if (!message) return CONTACT.whatsappHref;
  return `${CONTACT.whatsappHref}?text=${encodeURIComponent(message)}`;
}
