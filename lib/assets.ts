/**
 * Single source of truth for every static image shipped in `public/`.
 *
 * Consumers must never hardcode a file name — import from here so that
 * re-exporting, re-optimising or swapping an asset is a one-file change.
 *
 * Every entry is spread-compatible with `next/image`:
 *
 * ```tsx
 * import Image from "next/image";
 * import { assets } from "@/lib/assets";
 *
 * <Image {...assets.hero} priority sizes="100vw" />
 * ```
 */
export type ImageAsset = {
  /** Public path, always root-relative. */
  src: string;
  /** Intrinsic pixel width of the file on disk. */
  width: number;
  /** Intrinsic pixel height of the file on disk. */
  height: number;
  /** Arabic alternative text. Override per-usage when context demands it. */
  alt: string;
};

const asset = (
  src: string,
  width: number,
  height: number,
  alt: string,
): ImageAsset => ({ src, width, height, alt });

export const assets = {
  /** Full-bleed hero background: waterfront villa, infinity pool, private dock. */
  hero: asset(
    "/hero-waterfront-villa.png",
    2400,
    1691,
    "فيلا فاخرة على الواجهة البحرية مع مسبح لا متناه ومرسى خاص",
  ),

  /** Stacked line-art logo (building mark + wordmark). Navbar and footer. */
  logoStacked: asset("/logo-stacked.png", 90, 114, "أرزاق العقارية"),
  /** Horizontal serif "ARZAQ" wordmark. Mobile header. */
  logoWordmark: asset("/logo-wordmark.png", 238, 72, "أرزاق"),

  /** Wide 16:9-ish property photography (1056x560). */
  propertyVillaPool: asset(
    "/property-villa-pool.png",
    1056,
    560,
    "فيلا فاخرة بمسبح وجلسة خارجية ومواقف مظللة",
  ),
  propertyTowerMarina: asset(
    "/property-tower-marina.png",
    1056,
    560,
    "برج المنار على الواجهة البحرية مع اليخوت وأبراج الكويت",
  ),

  /** 656x560 landscape photography — service cards and article thumbnails. */
  towerAlManar: asset(
    "/tower-al-manar.png",
    656,
    560,
    "برج المنار السكني المطل على المرسى",
  ),
  villaForSale: asset(
    "/villa-for-sale.png",
    656,
    560,
    "فيلا من ثلاثة أدوار بمسبح ولوحة \u201cللبيع\u201d على البوابة",
  ),
  villaStonePatio: asset(
    "/villa-stone-patio.png",
    656,
    560,
    "فيلا بواجهة حجرية مع مسبح وجلسة طعام خارجية",
  ),

  /** 504x504 square photography — compact property and article thumbnails. */
  towerPavilion: asset(
    "/tower-pavilion.png",
    504,
    504,
    "برج ذا بافيليون ريزيدنسز السكني",
  ),
  villaInfinityPool: asset(
    "/villa-infinity-pool.png",
    504,
    504,
    "فيلا عصرية بمسبح لا متناه وحديقة منسقة",
  ),

  /**
   * 656x652 team portraits. These are shot on a solid black background —
   * place them on a dark or gradient surface, never assume a white cut-out.
   */
  team01: asset("/team-01.png", 656, 652, "أحد أعضاء فريق أرزاق العقارية"),
  team02: asset("/team-02.png", 656, 652, "أحد أعضاء فريق أرزاق العقارية"),
  team03: asset("/team-03.png", 656, 652, "أحد أعضاء فريق أرزاق العقارية"),
} as const satisfies Record<string, ImageAsset>;

export type AssetKey = keyof typeof assets;

/** Ordered pool of the three available team portraits, for reuse across members. */
export const teamPortraits = [
  assets.team01,
  assets.team02,
  assets.team03,
] as const;

/** Resolve an asset by key. Returns `undefined` for unknown keys. */
export function getAsset(key: string): ImageAsset | undefined {
  return (assets as Record<string, ImageAsset>)[key];
}
