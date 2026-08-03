import { assets } from "@/lib/assets";
import { CONTACT, whatsappLink } from "@/lib/site";
import type { TeamMember } from "@/features/team/types";

/**
 * Only three portraits exist in `public/`, so the six members intentionally
 * reuse them in rotation rather than referencing files that do not exist.
 */
const portraits = [assets.team01, assets.team02, assets.team03];

const ROLE = "مستشار مبيعات";

const members: Array<{ slug: string; name: string }> = [
  { slug: "abdulaziz-alrashid", name: "عبدالعزيز الرشيد" },
  { slug: "faisal-alanzi", name: "فيصل العنزي" },
  { slug: "mishari-aldosari", name: "مشاري الدوسري" },
  { slug: "bader-almutairi", name: "بدر المطيري" },
  { slug: "yousef-alkhalidi", name: "يوسف الخالدي" },
  { slug: "talal-alajmi", name: "طلال العجمي" },
];

export const team: TeamMember[] = members.map((member, index) => ({
  id: `tm-${String(index + 1).padStart(3, "0")}`,
  slug: member.slug,
  name: member.name,
  role: ROLE,
  image: { ...portraits[index % portraits.length], alt: member.name },
  phone: CONTACT.phone,
  phoneHref: CONTACT.phoneHref,
  whatsappHref: whatsappLink(`مرحبا ${member.name}، أرغب بالاستفسار عن عقار.`),
  email: CONTACT.email,
}));
