import type { ComponentType } from "react";
import { getTranslations } from "next-intl/server";
import { Phone, Mail } from "lucide-react";

import { SiteLogo } from "@/components/brand/site-logo";
import { Container } from "@/components/common/container";
import { HapticLink } from "@/components/common/haptic-link";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/features/settings/server";
import {
  resolveContact,
  resolveSocials,
} from "@/features/settings/merge";
import {
  FOOTER_LINK_COLUMNS,
  LEGAL_LINKS,
  type SocialKey,
} from "@/lib/site";
import { cn } from "@/lib/utils";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<SocialKey, ComponentType<{ className?: string }>> = {
  instagram: InstagramIcon,
  whatsapp: WhatsAppIcon,
  x: XIcon,
};

/**
 * Site footer — brand, two link columns, contact, legal row.
 * Contact / socials prefer `GET /settings` when present.
 */
export async function Footer({
  className,
  demoMode = false,
}: {
  className?: string;
  demoMode?: boolean;
}) {
  const [t, tNav, settings] = await Promise.all([
    getTranslations("Footer"),
    getTranslations("Nav"),
    getSiteSettings(),
  ]);

  const contact = resolveContact(settings);
  const socials = resolveSocials(settings);
  const address = contact.address?.trim() || t("contact.address");

  return (
    <footer
      className={cn("border-t border-border bg-muted text-ink", className)}
    >
      <Container className="py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
          <div className="flex flex-col gap-5">
            <HapticLink href="/" aria-label={t("logoAlt")} className="w-fit">
              <SiteLogo
                variant="stacked"
                demo={demoMode}
                alt={t("logoAlt")}
                className="h-14 w-auto"
                sizes="56px"
              />
            </HapticLink>
            <p className="max-w-sm text-sm/relaxed text-pretty text-ink-muted">
              {t("about")}
            </p>
            <ul
              className="flex items-center gap-2"
              aria-label={t("socialsLabel")}
            >
              {socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.key];
                return (
                  <li key={social.key}>
                    <Button
                      variant="white"
                      size="icon-pill-sm"
                      asChild
                      haptics={false}
                      className="border border-border shadow-xs"
                    >
                      <HapticLink
                        href={social.href}
                        external
                        aria-label={t(`socials.${social.key}`)}
                      >
                        <Icon className="size-4 text-ink" />
                      </HapticLink>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>

          {FOOTER_LINK_COLUMNS.map((column) => (
            <div key={column.titleKey}>
              <h2 className="mb-4 text-base font-bold">{t(column.titleKey)}</h2>
              <ul className="flex flex-col gap-2.5">
                {column.items.map((item) => (
                  <li key={`${item.source}-${item.key}`}>
                    <HapticLink
                      href={item.href}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {item.source === "nav"
                        ? tNav(`items.${item.key}`)
                        : t(`links.${item.key}`)}
                    </HapticLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="mb-4 text-base font-bold">{t("contactTitle")}</h2>
            <ul className="flex flex-col gap-3 text-sm text-ink-muted">
              <li>
                <span className="sr-only">{t("contact.addressLabel")}</span>
                <p className="text-pretty leading-relaxed">{address}</p>
              </li>
              <li>
                <HapticLink
                  href={contact.emailHref}
                  className="inline-flex items-center gap-2 transition-colors hover:text-ink"
                >
                  <Mail className="size-4 shrink-0" aria-hidden />
                  <span>
                    <span className="sr-only">{t("contact.emailLabel")}: </span>
                    {contact.email}
                  </span>
                </HapticLink>
              </li>
              <li>
                <HapticLink
                  href={contact.phoneHref}
                  className="inline-flex items-center gap-2 transition-colors hover:text-ink"
                >
                  <Phone className="size-4 shrink-0" aria-hidden />
                  <span>
                    <span className="sr-only">{t("contact.phoneLabel")}: </span>
                    {contact.phone}
                  </span>
                </HapticLink>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col gap-3 py-5 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright")}</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.key}>
                <HapticLink
                  href={link.href}
                  className="underline-offset-4 transition-colors hover:text-ink hover:underline"
                >
                  {t(link.key)}
                </HapticLink>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
