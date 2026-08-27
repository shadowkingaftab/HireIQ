import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plug, CreditCard, UserRound, LogOut, Building2, Check } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Tabs, { TabPanel } from "../components/ui/Tabs";
import Badge from "../components/ui/Badge";
import { useAuthStore } from "../store/authStore";
import { toast } from "../store/toastStore";
import IntegrationCard from "../components/integrations/IntegrationCard";
import UsageMeter from "../components/billing/UsageMeter";
import BillingHistory from "../components/billing/BillingHistory";
import PricingCard from "../components/billing/PricingCard";
import { DEMO_ORG } from "../demo/demoData";
import { organizationApi } from "../services/organizationApi";

/**
 * Account settings — profile, workspace (recruiter), integrations and
 * billing in one place. Saves hit the real settings endpoint when available;
 * otherwise changes stay local and say so.
 */
export default function Settings() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    headline: "",
  });
  const [saving, setSaving] = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await organizationApi.updateSettings(profile).catch(() => null); // endpoint may not exist yet
      toast.success("Profile saved locally — cloud sync starts when the service is live.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Your identity, workspace, connected evidence sources and plan."
        actions={
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
              toast.success("Signed out");
            }}
            leadingIcon={<LogOut size={15} />}
          >
            Sign out
          </Button>
        }
      />

      <Tabs
        defaultValue="profile"
        items={[
          { value: "profile", label: "Profile", icon: UserRound },
          { value: "workspace", label: "Workspace", icon: Building2 },
          { value: "integrations", label: "Integrations", icon: Plug },
          { value: "billing", label: "Billing", icon: CreditCard },
        ]}
        className="overflow-x-auto"
      />

      <TabPanel value="profile" defaultValue="profile">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,32rem)_16rem]">
          <Card>
            <Card.Header><Card.Title>Identity</Card.Title></Card.Header>
            <Card.Content>
              <div className="flex flex-col gap-4">
                <Input label="Full name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} autoComplete="name" />
                <Input label="Email" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} autoComplete="email" description="Used for verification notices and recruiter contact." />
                <Input label="Headline" value={profile.headline} onChange={(e) => setProfile((p) => ({ ...p, headline: e.target.value }))} placeholder="e.g. Backend engineer — distributed systems" />
                <div className="flex justify-end">
                  <Button onClick={saveProfile} loading={saving}>Save changes</Button>
                </div>
              </div>
            </Card.Content>
          </Card>
          <Card className="h-fit border-line-subtle/70 bg-surface-1/40">
            <Card.Header><Card.Title>Session</Card.Title></Card.Header>
            <Card.Content>
              <ul role="list" className="flex flex-col gap-2.5 text-meta text-ink-muted">
                <li className="flex items-center justify-between"><span>Role</span><Badge tone="info" size="sm">{user?.role || "unassigned"}</Badge></li>
                <li className="flex items-center justify-between"><span>Token storage</span><span className="font-mono text-micro">localStorage["token"]</span></li>
                <li className="flex items-center justify-between"><span>Auth backend</span><Badge tone="caution" size="sm">stub — 501</Badge></li>
              </ul>
            </Card.Content>
          </Card>
        </div>
      </TabPanel>

      <TabPanel value="workspace" defaultValue="profile">
        <Card>
          <Card.Header><Card.Title>Organization</Card.Title></Card.Header>
          <Card.Content>
            <div className="flex flex-wrap items-center gap-4 rounded-lg border border-line-subtle bg-surface-1/60 p-4">
              <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-lg border border-intel/25 bg-intel-soft font-mono text-body-sm font-bold text-intel">NL</span>
              <div>
                <p className="text-body-sm font-medium text-ink-hi">{DEMO_ORG.name}</p>
                <p className="text-meta text-ink-muted">{DEMO_ORG.seatsUsed} of {DEMO_ORG.seatsTotal} seats used · {DEMO_ORG.plan} plan</p>
              </div>
              <Badge tone="success" size="sm" dot>active</Badge>
            </div>
            <p className="mt-3 text-meta text-ink-faint">
              Team management lives with the organization service; member invites unlock once the users API is live.
            </p>
          </Card.Content>
        </Card>
      </TabPanel>

      <TabPanel value="integrations" defaultValue="profile">
        <IntegrationsSection embedded />
      </TabPanel>

      <TabPanel value="billing" defaultValue="profile">
        <BillingSection embedded />
      </TabPanel>
    </div>
  );
}

function CardTitle({ children }) {
  return <h2 className="text-section-sm font-semibold tracking-tight text-ink-hi">{children}</h2>;
}

/** Shared integrations surface (page + settings tab). */
export function IntegrationsSection({ embedded = false }) {
  return (
    <div className="flex flex-col gap-4">
      {!embedded && (
        <p className="-mt-2 max-w-2xl text-body-sm text-ink-muted">
          Evidence sources connect here. A provider's status reflects whether the backend ingestion service currently
          accepts it.
        </p>
      )}
      <IntegrationCard
        name="GitHub"
        description="Repositories, merged contributions and commit history feed repository-type evidence automatically."
        status="available"
        icon={
          <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/>
          </svg>
        }
      />
      <IntegrationCard name="LinkedIn" description="Career history import for work-history claims pending endorsement." status="coming_soon" />
      <IntegrationCard name="Assessment platform" description="Supervised assessment results publish directly into your proof graph." status="connected_partial" note="Scoring pipeline is stubbed server-side (501)." />
    </div>
  );
}

/** Shared billing surface (page + settings tab). */
export function BillingSection({ embedded = false }) {
  return (
    <div className={`grid grid-cols-1 gap-6 ${embedded ? "" : "lg:grid-cols-[22rem_1fr]"}`}>
      <PricingCard
        name={DEMO_ORG.plan}
        price="$499"
        period="/month"
        features={["10 seats included", "Unlimited jobs", "Match explanations", "Evidence analytics"]}
        current
      />
      <div className="flex flex-col gap-5">
        <Card>
          <Card.Header><Card.Title>This cycle</Card.Title></Card.Header>
          <Card.Content>
            <UsageMeter label="Candidate searches" used={412} limit={1000} />
            <UsageMeter label="Assessments sent" used={23} limit={80} className="mt-4" />
            <UsageMeter label="Evidence verifications" used={96} limit={250} className="mt-4" />
          </Card.Content>
        </Card>
        <BillingHistory
          items={[
            { id: "INV-2026-08", date: "2026-08-01", amount: "$499.00", status: "paid" },
            { id: "INV-2026-07", date: "2026-07-01", amount: "$499.00", status: "paid" },
            { id: "INV-2026-06", date: "2026-06-01", amount: "$499.00", status: "paid" },
          ]}
        />
      </div>
    </div>
  );
}
