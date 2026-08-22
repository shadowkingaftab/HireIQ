import { useState, useEffect } from "react";

export function useCommandPalette(open, onClose) {
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (open) setQuery("");
  }, [open]);
  return { query, setQuery, onClose };
}
