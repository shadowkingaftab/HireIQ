import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

/**
 * Structured fallback for routes that exist in navigation but are not yet
 * implemented, and for genuinely unknown URLs. Honest by design.
 */
export default function NotFound() {
  return (
    <div className="animate-fade-up">
      <PageHeader title="Page not found" />
      <Card className="mt-8">
        <EmptyState
          icon={Compass}
          title="This area isn't available yet"
          description="The page you requested doesn't exist, or is part of ProofHire that hasn't shipped. Use the command palette (⌘K) or the links below to keep moving."
          action={
            <Link to="/dashboard" className="rounded-lg focus-visible:outline-none">
              <Button size="sm">Back to overview</Button>
            </Link>
          }
        />
      </Card>
    </div>
  );
}
