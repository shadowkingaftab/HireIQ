import { Outlet } from "react-router-dom";

export default function CandidateLayout() {
  return (
    <div>
      <h1>Candidate Area</h1>
      <Outlet />
    </div>
  );
}
