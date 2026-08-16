import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function MetaTags({ title, description }) {
  const location = useLocation();
  useEffect(() => {
    document.title = title || "ProofHire";
  }, [title]);
  return null;
}
