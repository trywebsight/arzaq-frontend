"use client";

import { LatestArticles } from "@/features/blog/latest-articles";
import {
  AboutSection,
  HeroSection,
  ServicesSection,
} from "@/features/home/sections";
import { FeaturedProperties } from "@/features/properties/featured-properties";
import { useHomeContent } from "@/features/settings/hooks";
import { resolveHomeLimits } from "@/features/settings/merge";
import { TeamSection } from "@/features/team/team-section";

/**
 * Home main composition. Section limits come from `GET /home` when set.
 */
export function HomePageContent() {
  const homeQuery = useHomeContent();
  const limits = resolveHomeLimits(homeQuery.data);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturedProperties limit={limits.featuredPropertyLimit} />
      <ServicesSection limit={limits.servicesLimit} />
      <TeamSection limit={limits.teamLimit} />
      <LatestArticles limit={limits.latestPostsLimit} />
    </>
  );
}
