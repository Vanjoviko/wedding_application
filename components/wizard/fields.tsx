import type { ReactNode } from "react";

const inputClass =
  "mt-1.5 h-12 w-full rounded-count border border-line bg-bg px-3.5 text-body text-ink " +
  "placeholder:text-muted/60 focus-visible:ring-2 focus-visible:ring-focus " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none";

export function Field({
  label,
  hint,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="mt-4 first:mt-0">
      <label htmlFor={htmlFor} className="block text-meta text-muted">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-note text-muted/80">{hint}</p> : null}
    </div>
  );
}

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  maxLength,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "date" | "time" | "url";
  inputMode?: "text" | "numeric" | "tel" | "url";
  maxLength?: number;
}) {
  return (
    <input
      id={id}
      type={type}
      inputMode={inputMode}
      value={value}
      maxLength={maxLength}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={inputClass}
    />
  );
}

export function TextArea({
  id,
  value,
  onChange,
  rows = 4,
  maxLength,
  placeholder,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  maxLength?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      id={id}
      rows={rows}
      value={value}
      maxLength={maxLength}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={`${inputClass} h-auto resize-y py-3`}
    />
  );
}

export function Select({
  id,
  value,
  onChange,
  options,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={inputClass}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 border-b border-line py-4 last:border-b-0">
      <span>
        <span className="block text-body text-ink">{label}</span>
        <span className="mt-0.5 block text-meta text-muted">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 size-5 accent-[var(--accent)]"
      />
    </label>
  );
}

export function SubHead({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-8 mb-2 border-t border-line pt-6 text-body font-medium text-ink first:mt-0 first:border-0 first:pt-0">
      {children}
    </h3>
  );
}
