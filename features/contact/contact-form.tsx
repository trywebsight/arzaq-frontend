"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

import { submitContact } from "@/features/contact/api";
import {
  createContactSchema,
  type ContactFormValues,
} from "@/features/contact/schema";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { asPhoneCountry, DEFAULT_PHONE_COUNTRY, toE164 } from "@/lib/phone";
import { cn } from "@/lib/utils";

const inputClassName =
  "h-12 rounded-xl border-border bg-background px-4 text-base md:text-base";

/**
 * Contact form: name + email row, phone (country + national), message, submit.
 * Validates with Zod + libphonenumber-js; mock-succeeds via `submitContact`.
 */
export function ContactForm({ className }: { className?: string }) {
  const t = useTranslations("ContactPage.form");
  const [succeeded, setSucceeded] = React.useState(false);

  const schema = React.useMemo(
    () =>
      createContactSchema({
        nameRequired: t("errors.nameRequired"),
        emailInvalid: t("errors.emailInvalid"),
        phoneRequired: t("errors.phoneRequired"),
        phoneInvalid: t("errors.phoneInvalid"),
        messageMin: t("errors.messageMin"),
      }),
    [t],
  );

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      country: DEFAULT_PHONE_COUNTRY,
      phone: "",
      message: "",
    },
    mode: "onBlur",
  });

  const country = useWatch({ control: form.control, name: "country" });

  const onSubmit = form.handleSubmit(async (values) => {
    setSucceeded(false);
    try {
      const region = asPhoneCountry(values.country);
      const phone = toE164(values.phone, region);
      if (!phone) {
        form.setError("phone", { message: t("errors.phoneInvalid") });
        return;
      }
      await submitContact({ ...values, country: region, phone });
      setSucceeded(true);
      form.reset();
    } catch {
      form.setError("root", { message: t("errors.submitFailed") });
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn("w-full", className)}
      aria-describedby={succeeded ? "contact-form-success" : undefined}
    >
      <FieldGroup className="gap-3 md:gap-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel htmlFor="contact-name">{t("name.label")}</FieldLabel>
                <Input
                  {...field}
                  id="contact-name"
                  type="text"
                  autoComplete="name"
                  placeholder={t("name.placeholder")}
                  aria-invalid={fieldState.invalid}
                  className={inputClassName}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel htmlFor="contact-email">
                  {t("email.label")}
                </FieldLabel>
                <Input
                  {...field}
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  dir="ltr"
                  placeholder={t("email.placeholder")}
                  aria-invalid={fieldState.invalid}
                  className={cn(inputClassName, "text-start")}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor="contact-phone">{t("phone.label")}</FieldLabel>
              <PhoneInput
                id="contact-phone"
                name={field.name}
                country={country}
                onCountryChange={(next) => {
                  form.setValue("country", next, { shouldDirty: true });
                  if (field.value) {
                    void form.trigger("phone");
                  }
                }}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={t("phone.placeholder")}
                countryAriaLabel={t("phone.countryLabel")}
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1.5">
              <FieldLabel htmlFor="contact-message">
                {t("message.label")}
              </FieldLabel>
              <Textarea
                {...field}
                id="contact-message"
                rows={6}
                placeholder={t("message.placeholder")}
                aria-invalid={fieldState.invalid}
                className="min-h-36 rounded-xl border-border bg-background px-4 py-3 text-base md:text-base"
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        {form.formState.errors.root ? (
          <FieldError>{form.formState.errors.root.message}</FieldError>
        ) : null}

        {succeeded ? (
          <p
            id="contact-form-success"
            role="status"
            className="rounded-xl border border-primary/20 bg-accent px-4 py-3 text-sm text-ink"
          >
            {t("success")}
          </p>
        ) : null}

        <div>
          <Button
            type="submit"
            variant="primary"
            size="pill"
            disabled={form.formState.isSubmitting}
            className="min-w-40"
          >
            {form.formState.isSubmitting ? t("submitting") : t("submit")}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
