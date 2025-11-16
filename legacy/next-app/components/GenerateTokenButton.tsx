"use client";

import { useState } from "react";
import { GenerateTokenModal } from "./GenerateTokenModal";

export function GenerateTokenButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
      >
        <span>➕</span>
        <span>Generar Token</span>
      </button>

      {isOpen && (
        <GenerateTokenModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

