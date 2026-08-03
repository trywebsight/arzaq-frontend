import { z } from "zod";

import {
  asPhoneCountry,
  isValidNationalPhone,
  westernDigitsOnly,
} from "@/lib/phone";

export type ContactFormMessages = {
  nameRequired: string;
  emailInvalid: string;
  phoneRequired: string;
  phoneInvalid: string;
  messageMin: string;
};

/**
 * Builds the contact form Zod schema with localised error messages.
 * Phone is validated as national digits + ISO country via libphonenumber-js.
 *
 * @param messages - Arabic strings from `ContactPage.form.errors`.
 *
 * @example
 * const schema = createContactSchema({
 *   nameRequired: t("form.errors.nameRequired"),
 *   emailInvalid: t("form.errors.emailInvalid"),
 *   phoneRequired: t("form.errors.phoneRequired"),
 *   phoneInvalid: t("form.errors.phoneInvalid"),
 *   messageMin: t("form.errors.messageMin"),
 * });
 */
export function createContactSchema(messages: ContactFormMessages) {
  return z
    .object({
      name: z.string().trim().min(2, messages.nameRequired),
      email: z
        .string()
        .trim()
        .min(1, messages.emailInvalid)
        .email(messages.emailInvalid),
      country: z.string().min(1),
      phone: z.string().trim().min(1, messages.phoneRequired),
      message: z.string().trim().min(10, messages.messageMin),
    })
    .superRefine((data, ctx) => {
      const digits = westernDigitsOnly(data.phone);
      if (!digits || digits !== data.phone.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message: messages.phoneInvalid,
        });
        return;
      }
      if (!isValidNationalPhone(digits, asPhoneCountry(data.country))) {
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message: messages.phoneInvalid,
        });
      }
    });
}

export type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;
