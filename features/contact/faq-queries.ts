import { queryOptions } from "@tanstack/react-query";

import { fetchFaqs } from "@/features/contact/faq-api";
import { queryKeys } from "@/lib/query/keys";

export const faqsQuery = () =>
  queryOptions({
    queryKey: queryKeys.faqs.list(),
    queryFn: ({ signal }) => fetchFaqs(signal),
  });
