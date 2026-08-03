"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import {
  BoneSkeleton,
  Eyebrow,
  HapticLink,
  QueryState,
  Section,
} from "@/components/common";
import { Reveal, StaggerGroup } from "@/components/motion";
import { LegalDocumentSkeleton } from "@/features/legal/skeletons";
import { legalDocumentQuery } from "@/features/legal/queries";
import {
  isLegalDocumentEmpty,
  type LegalBlock,
  type LegalDocument,
  type LegalDocumentSlug,
  type LegalSection,
} from "@/features/legal/types";
import { CONTACT, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

function formatUpdatedDate(isoDate: string): string {
  if (!isoDate) return "";
  return new Intl.DateTimeFormat("ar-KW-u-nu-latn", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${isoDate}T12:00:00`));
}

function resolveContact(doc: LegalDocument) {
  const siteUrl = (doc.contact?.websiteUrl ?? siteConfig.url).replace(/\/$/, "");
  return {
    email: doc.contact?.email ?? CONTACT.email,
    emailHref: doc.contact?.emailHref ?? CONTACT.emailHref,
    phone: doc.contact?.phone ?? CONTACT.phone,
    phoneHref: doc.contact?.phoneHref ?? CONTACT.phoneHref,
    websiteUrl: siteUrl,
    displayHost: siteUrl.replace(/^https?:\/\//, ""),
  };
}

function LegalBlocks({
  blocks,
  doc,
}: {
  blocks: LegalBlock[];
  doc: LegalDocument;
}) {
  const contact = resolveContact(doc);

  return (
    <div className="mt-3 space-y-3 md:mt-4 md:space-y-4">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        if (block.type === "paragraph") {
          return (
            <p
              key={key}
              className="text-base/relaxed text-pretty text-ink-muted md:text-lg"
            >
              {block.text}
            </p>
          );
        }

        if (block.type === "list") {
          return (
            <ul
              key={key}
              className="flex list-none flex-col gap-2 ps-0 md:gap-2.5"
            >
              {block.items.map((item) => (
                <li
                  key={item}
                  className="relative ps-4 text-base/relaxed text-pretty text-ink-muted before:absolute before:inset-s-0 before:content-['–'] md:text-lg"
                >
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <ul
            key={key}
            className="flex list-none flex-col gap-2 ps-0 md:gap-2.5"
          >
            <li className="text-base/relaxed text-ink-muted md:text-lg">
              <span className="text-ink">{block.emailLabel}: </span>
              <HapticLink
                href={contact.emailHref}
                className="font-medium text-ink underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
              >
                {contact.email}
              </HapticLink>
            </li>
            <li className="text-base/relaxed text-ink-muted md:text-lg">
              <span className="text-ink">{block.phoneLabel}: </span>
              <HapticLink
                href={contact.phoneHref}
                className="font-medium text-ink underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
                dir="ltr"
              >
                {contact.phone}
              </HapticLink>
            </li>
            {block.websiteLabel ? (
              <li className="text-base/relaxed text-ink-muted md:text-lg">
                <span className="text-ink">{block.websiteLabel}: </span>
                <HapticLink
                  href={contact.websiteUrl}
                  className="font-medium text-ink underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
                  dir="ltr"
                >
                  {contact.displayHost}
                </HapticLink>
              </li>
            ) : null}
          </ul>
        );
      })}
    </div>
  );
}

function LegalSectionArticle({
  section,
  index,
  doc,
  sectionNumber,
}: {
  section: LegalSection;
  index: number;
  doc: LegalDocument;
  sectionNumber: (n: number) => string;
}) {
  const titleId = `legal-${doc.slug}-${section.id}`;

  return (
    <article aria-labelledby={titleId}>
      <h2
        id={titleId}
        className="text-lg font-bold text-balance text-ink md:text-xl"
      >
        {sectionNumber(index + 1)} {section.title}
      </h2>
      <LegalBlocks blocks={section.blocks} doc={doc} />
    </article>
  );
}

function LegalDocumentView({
  doc,
  headingId,
}: {
  doc: LegalDocument;
  headingId: string;
}) {
  const t = useTranslations("LegalPage");
  const updatedLabel = doc.updatedAt
    ? t("updated", { date: formatUpdatedDate(doc.updatedAt) })
    : null;

  return (
    <Section
      aria-labelledby={headingId}
      spacing="default"
      containerSize="narrow"
      className={cn("pt-6 md:pt-8 xl:pt-10")}
    >
      <header className="mb-10 flex max-w-prose flex-col md:mb-14">
        {doc.eyebrow ? (
          <Reveal as="div" from="bottom" distance={14} trigger="mount">
            <Eyebrow className="mb-5 md:mb-6">{doc.eyebrow}</Eyebrow>
          </Reveal>
        ) : null}

        <Reveal as="div" from="bottom" distance={20} delay={0.05} trigger="mount">
          <h1
            id={headingId}
            className="text-3xl/[1.35] font-bold text-balance text-ink md:text-4xl xl:text-5xl"
          >
            {doc.title}
          </h1>
        </Reveal>

        {updatedLabel ? (
          <Reveal as="div" from="bottom" distance={14} delay={0.08} trigger="mount">
            <p className="mt-3 text-sm text-ink-muted md:mt-4 md:text-base">
              {updatedLabel}
            </p>
          </Reveal>
        ) : null}

        {doc.intro ? (
          <Reveal as="div" from="bottom" distance={16} delay={0.1} trigger="mount">
            <p className="mt-5 text-base/relaxed text-pretty text-ink-muted md:mt-6 md:text-lg xl:text-xl">
              {doc.intro}
            </p>
          </Reveal>
        ) : null}
      </header>

      <StaggerGroup
        as="div"
        className="flex max-w-prose flex-col gap-8 md:gap-10"
        stagger={0.08}
        distance={20}
      >
        {doc.sections.map((section, index) => (
          <LegalSectionArticle
            key={section.id}
            section={section}
            index={index}
            doc={doc}
            sectionNumber={(n) => t("sectionNumber", { n })}
          />
        ))}
      </StaggerGroup>
    </Section>
  );
}

export type LegalDocumentSectionProps = {
  slug: LegalDocumentSlug;
  headingId: string;
  className?: string;
};

/**
 * Fetches and renders a CMS legal document. Empty `sections` → empty state.
 */
export function LegalDocumentSection({
  slug,
  headingId,
  className,
}: LegalDocumentSectionProps) {
  const t = useTranslations("LegalPage");
  const query = useQuery(legalDocumentQuery(slug));

  return (
    <div className={className}>
      <QueryState
        query={query}
        isEmpty={isLegalDocumentEmpty}
        emptyTitle={t("empty.title")}
        emptyDescription={t("empty.description")}
        skeleton={
          <BoneSkeleton
            name="legal-document"
            loading
            fallback={<LegalDocumentSkeleton />}
          >
            <LegalDocumentSkeleton />
          </BoneSkeleton>
        }
      >
        {(doc) =>
          doc ? (
            <LegalDocumentView doc={doc} headingId={headingId} />
          ) : null
        }
      </QueryState>
    </div>
  );
}
