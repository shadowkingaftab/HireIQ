import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import Button from "../components/ui/Button";
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/Card";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import { Progress, ScoreRing, ConfidenceBar } from "../components/ui/Progress";
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonTable } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Tabs, { TabPanel } from "../components/ui/Tabs";
import Dialog from "../components/ui/Dialog";
import Drawer from "../components/ui/Drawer";
import Tooltip from "../components/ui/Tooltip";
import Container from "../components/ui/Container";
import Stack from "../components/ui/Stack";
import Grid from "../components/ui/Grid";
import Section from "../components/ui/Section";
import Divider from "../components/ui/Divider";
import PageHeader from "../components/ui/PageHeader";

export default function UIShowcase() {
  const [tab, setTab] = useState("overview");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dark = document.documentElement.classList.contains("dark");

  return (
    <div className={dark ? "" : "dark"}>
      <div className="min-h-dvh bg-canvas bg-atmosphere py-10 text-ink-hi">
        <Container size="md">
          <PageHeader
            eyebrow="Internal"
            title="ProofHire UI Kit"
            description="Visual verification surface for the design system. Not routed in production."
            actions={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const el = document.documentElement;
                  const next = el.classList.toggle("dark");
                  localStorage.setItem("theme", next ? "dark" : "light");
                  setTab(tab);
                }}
              >
                Toggle theme
              </Button>
            }
          />

          <Stack gap="xl" className="mt-10">
            <Section title="Buttons" container={false} spacing="sm">
              <Card>
                <CardContent>
                  <Stack gap="md">
                    <Stack direction="row" gap="sm" wrap align="center">
                      <Button variant="primary">Primary</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="success">Success</Button>
                    </Stack>
                    <Stack direction="row" gap="sm" wrap align="center">
                      <Button size="sm" leadingIcon={Sparkles}>Small</Button>
                      <Button loading>Loading</Button>
                      <Button disabled>Disabled</Button>
                      <Button size="lg" trailingIcon={Search}>Large</Button>
                      <Tooltip content="Dense-data hint text">
                        <Button variant="ghost" aria-label="Help">?</Button>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Section>

            <Section title="Cards & badges" container={false} spacing="sm">
              <Grid cols={3}>
                <Card variant="interactive">
                  <CardHeader>
                    <CardTitle>Interactive card</CardTitle>
                    <CardDescription>Hover lift, no glow</CardDescription>
                  </CardHeader>
                  <CardContent className="text-body-sm text-ink-muted">
                    Evidence-first candidate intelligence.
                  </CardContent>
                  <CardFooter>
                    <Badge tone="strong" dot>Evidence: strong</Badge>
                  </CardFooter>
                </Card>
                <Card variant="elevated">
                  <CardContent>
                    <Stack direction="row" gap="sm" wrap>
                      <Badge tone="neutral">neutral</Badge>
                      <Badge tone="info">info</Badge>
                      <Badge tone="success">verified</Badge>
                      <Badge tone="warning">uncertain</Badge>
                      <Badge tone="danger">danger</Badge>
                      <Badge tone="moderate" dot mono>moderate</Badge>
                      <Badge tone="weak" dot mono>weak</Badge>
                    </Stack>
                    <Divider label="divider" className="my-4" />
                    <Progress value={91} label="API architecture" />
                    <ConfidenceBar value={89} uncertainty={6} label="Capability confidence" />
                  </CardContent>
                </Card>
                <Card variant="glass">
                  <CardContent className="flex items-center justify-around">
                    <ScoreRing value={94} label="Match" />
                    <ScoreRing value={72} tone="verified" label="Verified" />
                  </CardContent>
                </Card>
              </Grid>
            </Section>

            <Section title="Forms" container={false} spacing="sm">
              <Card>
                <CardContent>
                  <Grid cols={2}>
                    <Input label="Email" type="email" placeholder="you@company.com" description="Work email recommended." />
                    <Input label="Password" type="password" placeholder="••••••••" />
                    <Input label="With icon" leadingIcon={Search} placeholder="Search candidates" />
                    <Input label="With error" defaultValue="proofhire" error="That handle is already taken." />
                  </Grid>
                </CardContent>
              </Card>
            </Section>

            <Section title="Tabs & overlays" container={false} spacing="sm">
              <Card>
                <CardContent>
                  <Tabs
                    value={tab}
                    onChange={setTab}
                    items={[
                      { value: "overview", label: "Overview" },
                      { value: "evidence", label: "Evidence" },
                      { value: "assessments", label: "Assessments", disabled: true },
                    ]}
                  />
                  <TabPanel value="overview" active={tab} className="mt-4">
                    <p className="text-body-sm text-ink-muted">Keyboard: try Arrow keys while focused.</p>
                  </TabPanel>
                  <TabPanel value="evidence" active={tab} className="mt-4">
                    <SkeletonText lines={2} />
                  </TabPanel>
                  <Stack direction="row" gap="sm" className="mt-5">
                    <DialogTrigger setDialogOpen={setDialogOpen} />
                    <Button variant="outline" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
                  </Stack>
                </CardContent>
              </Card>
            </Section>

            <Section title="Loading & states" container={false} spacing="sm">
              <Grid cols={2}>
                <Stack gap="md">
                  <SkeletonCard />
                  <Stack direction="row" gap="md" align="center">
                    <SkeletonAvatar />
                    <SkeletonText lines={2} className="flex-1" />
                  </Stack>
                </Stack>
                <Stack gap="md">
                  <EmptyState
                    title="No matches yet"
                    description="Run a job match to see ranked candidates here."
                    action={<Button size="sm">Run matching</Button>}
                  />
                  <ErrorState compact onRetry={() => {}} />
                </Stack>
              </Grid>
              <div className="mt-6">
                <SkeletonTable rows={3} columns={4} />
              </div>
            </Section>
          </Stack>
        </Container>
      </div>

      <DemoDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Evidence inspector" description="Repository · acme/payments-core">
        <Stack gap="md">
          <SkeletonText lines={3} />
          <Badge tone="strong" dot mono>provenance verified</Badge>
        </Stack>
      </Drawer>
    </div>
  );
}

function DialogTrigger({ setDialogOpen }) {
  return (
    <Button variant="secondary" onClick={() => setDialogOpen(true)}>
      Open dialog
    </Button>
  );
}

function DemoDialog({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Confirm assessment invite"
      description="The candidate receives a secure session link valid for 7 days."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Send invite</Button>
        </>
      }
    >
      <Input label="Candidate email" type="email" data-autofocus placeholder="candidate@example.com" />
    </Dialog>
  );
}
