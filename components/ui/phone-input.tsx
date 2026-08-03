"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/motion/select";
import { Input } from "@/components/ui/input";
import {
  DEFAULT_PHONE_COUNTRY,
  getPhoneCountryOptions,
  westernDigitsOnly,
} from "@/lib/phone";
import { cn } from "@/lib/utils";

const COUNTRY_OPTIONS = getPhoneCountryOptions();

export type PhoneInputProps = {
  id?: string;
  country: string;
  onCountryChange: (country: string) => void;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Accessible name for the country-code Select (from messages). */
  countryAriaLabel: string;
  "aria-invalid"?: boolean;
  className?: string;
  inputClassName?: string;
};

/**
 * Country-code Select + national number input. Emits Western digits only;
 * pair with `isValidNationalPhone` / `toE164` for validation and submit.
 *
 * @param country - ISO region (default KW via form defaults).
 * @param countryAriaLabel - Localized aria-label for the country Select.
 *
 * @example
 * <PhoneInput
 *   country={country}
 *   onCountryChange={setCountry}
 *   value={phone}
 *   onChange={setPhone}
 *   countryAriaLabel={t("phone.countryLabel")}
 * />
 */
export function PhoneInput({
  id,
  country,
  onCountryChange,
  value,
  onChange,
  onBlur,
  name,
  placeholder,
  disabled,
  countryAriaLabel,
  "aria-invalid": ariaInvalid,
  className,
  inputClassName,
}: PhoneInputProps) {
  const selected = country || DEFAULT_PHONE_COUNTRY;

  return (
    <div
      className={cn("flex w-full items-stretch gap-2", className)}
      dir="ltr"
    >
      <Select
        value={selected}
        onValueChange={onCountryChange}
        disabled={disabled}
        className="w-35 shrink-0"
      >
        <SelectTrigger
          aria-label={countryAriaLabel}
          className={cn(
            "h-12 rounded-xl border-border bg-background px-3 text-base",
            ariaInvalid && "border-destructive ring-3 ring-destructive/20",
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-72 overflow-y-auto">
          {COUNTRY_OPTIONS.map((option) => (
            <SelectItem
              key={option.code}
              value={option.code}
              label={option.label}
            >
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden className="text-base/none">
                  {option.flag}
                </span>
                <span>+{option.dialCode}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        id={id}
        name={name}
        type="tel"
        autoComplete="tel-national"
        inputMode="numeric"
        pattern="[0-9]*"
        dir="ltr"
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        aria-invalid={ariaInvalid}
        onBlur={onBlur}
        onChange={(event) => onChange(westernDigitsOnly(event.target.value))}
        className={cn(
          "h-12 min-w-0 flex-1 rounded-xl border-border bg-background px-4 text-base text-start md:text-base",
          inputClassName,
        )}
      />
    </div>
  );
}
