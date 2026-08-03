"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import type { TeamMember } from "@/features/team/types";
import { TeamCard } from "@/features/team/team-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export type TeamCarouselProps = {
  /** Members to page through. */
  members: TeamMember[];
  className?: string;
};

/**
 * RTL-aware team member carousel. Top/bottom padding on the Embla track gives
 * hover-lift room inside the overflow-hidden viewport so cards are not clipped.
 *
 * @param members - Ordered team members.
 * @example
 * <TeamCarousel members={team} />
 */
export function TeamCarousel({ members, className }: TeamCarouselProps) {
  const t = useTranslations("Common");

  if (members.length === 0) return null;

  return (
    <Carousel
      opts={{
        align: "start",
        loop: false,
        skipSnaps: false,
        dragFree: false,
        containScroll: "trimSnaps",
        duration: 28,
      }}
      className={cn("w-full", className)}
      aria-label={t("brand")}
    >
      {/* pt/pb keep hover translateY + scale inside the clipped Embla viewport */}
      <CarouselContent className="-ms-4 pt-4 pb-5 md:-ms-6 md:pt-5 md:pb-6">
        {members.map((member) => (
          <CarouselItem
            key={member.id}
            className="ps-4 basis-[78%] sm:basis-1/2 md:ps-6 lg:basis-1/3 xl:basis-1/4"
          >
            <TeamCard member={member} />
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="mt-4 flex items-center justify-start gap-2.5 md:mt-5">
        <CarouselPrevious
          variant="white"
          size="icon-pill"
          className="static inset-auto translate-none shadow-sm transition-[transform,box-shadow,opacity,background-color] duration-300 hover:scale-105 hover:bg-white hover:shadow-md active:scale-95 disabled:pointer-events-none disabled:opacity-35 motion-reduce:transition-none motion-reduce:hover:scale-100"
        />
        <CarouselNext
          variant="white"
          size="icon-pill"
          className="static inset-auto translate-none shadow-sm transition-[transform,box-shadow,opacity,background-color] duration-300 hover:scale-105 hover:bg-white hover:shadow-md active:scale-95 disabled:pointer-events-none disabled:opacity-35 motion-reduce:transition-none motion-reduce:hover:scale-100"
        />
      </div>
    </Carousel>
  );
}
