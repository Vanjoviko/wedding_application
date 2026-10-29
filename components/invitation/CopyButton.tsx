"use client";

import { useState } from "react";
import { CopyIcon } from "@/components/icons";
import { SecondaryButton } from "@/components/ui/SecondaryButton";

type Props = {
  value: string;
  label: string;
};

export function CopyButton({ value, label }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const helper = document.createElement("textarea");
      helper.value = value;
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      document.body.removeChild(helper);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <SecondaryButton onClick={() => void copy()} fullWidth icon={<CopyIcon size={16} />}>
      {copied ? "Tersalin" : label}
    </SecondaryButton>
  );
}
