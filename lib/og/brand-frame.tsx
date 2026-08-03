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

/**
 * Headline size tuned for Arabic connected script on a 1200×630 canvas.
 * Longer titles step down so line wraps stay readable without crushing.
 */
function titleFontSize(title: string): number {
  const len = title.trim().length;
  if (len > 64) return 44;
  if (len > 40) return 52;
  if (len > 24) return 58;
  return 64;
}

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
  const headlineSize = titleFontSize(title);

  return (
    <div
      style={{
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        display: "flex",
        flexDirection: "column",
        padding: "52px 60px 56px",
        color: OG_COLORS.white,
        fontFamily: "Cairo",
        // Intentionally LTR: Satori ignores CSS direction for Arabic runs; we
        // reverse tokens via satoriRtlText and align with flex-end instead.
        position: "relative",
        overflow: "hidden",
      }}
    >
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
          justifyContent: "flex-start",
          gap: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
            gap: 16,
            alignSelf: "flex-end",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 84,
              height: 84,
              borderRadius: 16,
              background: OG_COLORS.logoPlate,
              padding: 10,
            }}
          >
            {/* ImageResponse only supports raw <img>, not next/image. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- OG/Satori */}
            <img
              src={logoSrc}
              width={64}
              height={64}
              alt=""
              style={{ objectFit: "contain" }}
            />
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1.35,
              letterSpacing: 0,
              opacity: 0.98,
              textAlign: "right",
            }}
          >
            {brand}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            gap: 18,
            maxWidth: 1020,
            alignItems: "flex-end",
            alignSelf: "flex-end",
            paddingBottom: 8,
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
                    padding: "9px 18px",
                    borderRadius: 999,
                    background: OG_COLORS.chipBg,
                    fontSize: 22,
                    fontWeight: 600,
                    lineHeight: 1.35,
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
              fontSize: headlineSize,
              fontWeight: 800,
              lineHeight: 1.4,
              letterSpacing: 0,
              textAlign: "right",
              maxWidth: 1020,
            }}
          >
            {headline}
          </div>

          {sub ? (
            <div
              style={{
                fontSize: 30,
                fontWeight: 600,
                lineHeight: 1.5,
                color: OG_COLORS.whiteMuted,
                textAlign: "right",
                maxWidth: 900,
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
