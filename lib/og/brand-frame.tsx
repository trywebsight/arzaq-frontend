import { OG_COLORS, OG_SIZE } from "@/lib/og/assets";
import { satoriRtlText } from "@/lib/og/rtl";

export type OgChip = {
  /** Logical-order Arabic (or mixed) label. */
  label: string;
};

export type BrandOgFrameProps = {
  logoSrc: string;
  /** Brand name next to the logo plate. */
  brandName: string;
  /** Primary headline. */
  title: string;
  /** Optional supporting line under the title. */
  subtitle?: string;
  /** Small meta chips (reading time, purpose, city, …). */
  chips?: OgChip[];
  /** Soft background photo (data URL or absolute http URL). */
  photoSrc?: string | null;
};

const frameBase = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "space-between",
  padding: "56px 64px",
  color: OG_COLORS.white,
  fontFamily: "Cairo",
  // Intentionally LTR: Satori ignores CSS direction for Arabic runs; we
  // reverse tokens via satoriRtlText and align with flex-end instead.
  position: "relative" as const,
  overflow: "hidden" as const,
};

/**
 * Shared branded OG composition — logo plate, RTL Arabic copy, optional soft photo.
 *
 * @param props - Frame content; all Arabic strings in logical order.
 */
export function BrandOgFrame({
  logoSrc,
  brandName,
  title,
  subtitle,
  chips = [],
  photoSrc,
}: BrandOgFrameProps) {
  const brand = satoriRtlText(brandName);
  const headline = satoriRtlText(title);
  const sub = subtitle ? satoriRtlText(subtitle) : null;

  return (
    <div style={{ ...frameBase, width: OG_SIZE.width, height: OG_SIZE.height }}>
      {photoSrc ? (
        // ImageResponse only supports raw <img>, not next/image.
        // eslint-disable-next-line @next/next/no-img-element -- OG/Satori
        <img
          src={photoSrc}
          width={OG_SIZE.width}
          height={OG_SIZE.height}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : null}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: photoSrc
            ? `linear-gradient(115deg, ${OG_COLORS.overlay} 0%, rgba(0,173,233,0.55) 48%, rgba(35,31,32,0.78) 100%)`
            : `linear-gradient(145deg, ${OG_COLORS.primary} 0%, ${OG_COLORS.primaryDeep} 55%, ${OG_COLORS.ink} 160%)`,
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
            gap: 18,
            alignSelf: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: 18,
              background: OG_COLORS.logoPlate,
              padding: 10,
            }}
          >
            {/* ImageResponse only supports raw <img>, not next/image. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- OG/Satori */}
            <img
              src={logoSrc}
              width={68}
              height={68}
              alt=""
              style={{ objectFit: "contain" }}
            />
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: 0,
              opacity: 0.96,
              textAlign: "right",
            }}
          >
            {brand}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            maxWidth: 980,
            alignItems: "flex-end",
            alignSelf: "flex-end",
          }}
        >
          {chips.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                flexWrap: "wrap",
                gap: 10,
                justifyContent: "flex-start",
              }}
            >
              {chips.map((chip) => (
                <div
                  key={chip.label}
                  style={{
                    display: "flex",
                    padding: "8px 18px",
                    borderRadius: 999,
                    background: OG_COLORS.chipBg,
                    fontSize: 22,
                    fontWeight: 600,
                    textAlign: "right",
                  }}
                >
                  {satoriRtlText(chip.label)}
                </div>
              ))}
            </div>
          ) : null}

          <div
            style={{
              fontSize: title.length > 48 ? 48 : 58,
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: 0,
              textAlign: "right",
              maxWidth: 980,
            }}
          >
            {headline}
          </div>

          {sub ? (
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                lineHeight: 1.45,
                color: OG_COLORS.whiteMuted,
                textAlign: "right",
                maxWidth: 860,
              }}
            >
              {sub}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/**
 * Wrap a brand frame in `ImageResponse` options sizing.
 */
export function ogImageOptions(
  fonts: {
    name: string;
    data: ArrayBuffer;
    style: "normal";
    weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  }[],
) {
  return {
    ...OG_SIZE,
    fonts,
  };
}
