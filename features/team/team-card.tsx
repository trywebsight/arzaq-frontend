"use client";

import { cn } from "@/lib/utils";
import { hasImageSrc } from "@/lib/api/media";
import type { TeamMember } from "@/features/team/types";
import { HapticCard } from "@/components/common/haptic-card";
import { SmartImage } from "@/components/common/smart-image";

export type TeamCardProps = {
  /** Team member to render. */
  member: TeamMember;
  className?: string;
};

/**
 * White team portrait card with a subtle CSS hover lift + image zoom.
 * Transparent PNG cutouts composite on the card’s white background.
 *
 * @param member - Typed team member from the team feature.
 * @example
 * <TeamCard member={member} />
 */
export function TeamCard({ member, className }: TeamCardProps) {
  return (
    <HapticCard
      interactive={false}
      className={cn(
        "group flex flex-col overflow-hidden rounded-card border border-border bg-white shadow-xs transition-[translate,scale,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-md focus-within:-translate-y-1.5 focus-within:scale-[1.015] focus-within:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 motion-reduce:focus-within:translate-y-0 motion-reduce:focus-within:scale-100",
        className,
      )}
      data-card
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {hasImageSrc(member.image) ? (
          <SmartImage
            src={member.image.src}
            alt={member.image.alt || member.name}
            width={member.image.width}
            height={member.image.height}
            blurDataURL={member.image.blurDataURL}
            className="size-full object-cover object-top transition-[scale] duration-300 ease-out group-hover:scale-105 group-focus-within:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-within:scale-100"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
      </div>
      <div className="space-y-1 px-5 py-4 text-center">
        <h3 className="text-base font-bold text-ink md:text-lg">{member.name}</h3>
        <p className="text-sm text-ink-muted">{member.role}</p>
      </div>
    </HapticCard>
  );
}
