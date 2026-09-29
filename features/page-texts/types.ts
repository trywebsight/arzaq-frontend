import type { ImageAsset } from "@/lib/assets";

/**
 * `GET /page-texts`: dashboard overrides for fixed website texts and photos.
 * `texts` mirrors `messages/ar.json` paths and only holds changed values.
 */
export type PageTexts = {
  texts: Record<string, unknown>;
  images: {
    aboutIntro: ImageAsset | null;
    aboutMission: ImageAsset | null;
    servicesBuyers: ImageAsset | null;
  };
};

/** No overrides: every text and photo keeps the website default. */
export const EMPTY_PAGE_TEXTS: PageTexts = {
  texts: {},
  images: { aboutIntro: null, aboutMission: null, servicesBuyers: null },
};
