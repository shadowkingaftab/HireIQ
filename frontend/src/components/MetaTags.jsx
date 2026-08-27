import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { brand } from "../utils/brand";

export default function MetaTags({ title, description }) {
  const location = useLocation();
  useEffect(() => {
    document.title = title || brand.name;
  }, [title]);
  return null;
}
