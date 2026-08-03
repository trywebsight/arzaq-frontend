import type { LucideIcon } from "lucide-react";
import {
  Handshake,
  Megaphone,
  Shield,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

/**
 * Seller feature ids mapped to `ServicesPage.sellers.features.*` keys.
 */
export type SellerFeatureId = "simplify" | "marketing" | "experience";

/**
 * Buyer feature ids mapped to `ServicesPage.buyers.features.*` keys.
 */
export type BuyerFeatureId = "goals" | "protection" | "terms";

export type SellerFeature = {
  id: SellerFeatureId;
  icon: LucideIcon;
};

export type BuyerFeature = {
  id: BuyerFeatureId;
  icon: LucideIcon;
};

/** Ordered seller benefits for the Services page. */
export const SELLER_FEATURES: readonly SellerFeature[] = [
  { id: "simplify", icon: TrendingUp },
  { id: "marketing", icon: Megaphone },
  { id: "experience", icon: Handshake },
] as const;

/** Ordered buyer benefits for the Services page. */
export const BUYER_FEATURES: readonly BuyerFeature[] = [
  { id: "goals", icon: Target },
  { id: "protection", icon: Shield },
  { id: "terms", icon: Users },
] as const;
