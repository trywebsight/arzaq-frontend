import { assets } from "@/lib/assets";
import type { Service } from "@/features/services/types";

export const services: Service[] = [
  {
    id: "svc-001",
    slug: "property-management",
    title: "إدارة أملاك الغير",
    description:
      "نتولى مسؤولية تشغيل العقار بالكامل: تحصيل الإيجارات، وأعمال الصيانة، والمتابعة القانونية، ليحصل المالك على راحة بال كاملة وتقارير واضحة أولا بأول.",
    image: assets.towerAlManar,
  },
  {
    id: "svc-002",
    slug: "buying-and-selling",
    title: "البيع والشراء",
    description:
      "ندير الصفقات العقارية بدقة واحترافية، ونتفاوض نيابة عنك بما يحفظ مصلحة جميع الأطراف حتى توثيق العقد وتسليم المفاتيح.",
    image: assets.villaStonePatio,
  },
  {
    id: "svc-003",
    slug: "leasing-and-renting",
    title: "التأجير والاستئجار",
    description:
      "نوفر حلول تأجير متكاملة للمستأجرين والملاك، من التسويق واختيار المستأجر المناسب إلى صياغة العقود ومتابعة التحصيل.",
    image: assets.villaForSale,
  },
  {
    id: "svc-004",
    slug: "real-estate-consultancy",
    title: "الاستشارات العقارية",
    description:
      "نقدم استشارات متخصصة تساعدك على اتخاذ قرارات استثمارية مدروسة، مدعومة بمعرفة عميقة بالسوق الكويتي وتحليل واضح للفرص والمخاطر.",
    image: assets.propertyTowerMarina,
  },
];
