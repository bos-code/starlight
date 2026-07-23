"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyAddressButton({ address, className = "" }: { address: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — silently ignore, button simply won't confirm
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold text-brand-steel hover:text-brand-white ${className}`}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-brand-green" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy address"}
    </button>
  );
}
