import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div>
      <h1>ProofHire</h1>
      <Outlet />
    </div>
  );
}
