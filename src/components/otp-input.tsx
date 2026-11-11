"use client";

import { useRef } from "react";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  length?: number;
};

export function OtpInput({ value, onChange, onComplete, disabled, length = 6 }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  function update(next: string) {
    const clean = next.replace(/\D/g, "").slice(0, length);
    onChange(clean);
    if (clean.length === length) onComplete?.(clean);
  }

  function handleChange(index: number, raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return;
    const chars = value.padEnd(length, " ").split("");
    chars[index] = digits[0];
    update(chars.join("").replace(/ /g, ""));
    refs.current[Math.min(index + 1, length - 1)]?.focus();
  }

  function handleKeyDown(index: number, key: string) {
    if (key === "Backspace") {
      if (value[index]) {
        update(value.slice(0, index) + value.slice(index + 1));
      } else if (index > 0) {
        update(value.slice(0, index - 1) + value.slice(index));
        refs.current[index - 1]?.focus();
      }
    }
  }

  function handlePaste(text: string) {
    update(text);
    refs.current[Math.min(text.replace(/\D/g, "").length, length - 1)]?.focus();
  }

  return (
    <div className="flex justify-between gap-2" role="group" aria-label="Код подтверждения">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          value={value[index] ?? ""}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event.key)}
          onPaste={(event) => {
            event.preventDefault();
            handlePaste(event.clipboardData.getData("text"));
          }}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          aria-label={`Цифра ${index + 1}`}
          className="size-12 rounded-control border border-line bg-surface text-center font-heading text-xl outline-none focus:border-accent disabled:opacity-60 sm:size-14"
        />
      ))}
    </div>
  );
}
