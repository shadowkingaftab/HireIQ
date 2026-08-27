import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X, ShieldCheck } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import Tabs, { TabPanel } from "../components/ui/Tabs";
import { toast } from "../store/toastStore";
import { jobApi } from "../services/jobApi";

/**
 * INTELLIGENT JOB BUILDER — defines a role as a capability profile, not just
 * a form. Each step answers a question:
 *   1. What does the team need?           → title, description, location
 *   2. What capability profile wins here?  → requirements with weights + confidence floors
 *   3. What proof do we expect?            → evidence expectations
 *   4. Review & publish
 */
const defaultRequirement = () => ({ skill: "", weight: 0.2, minConfidence: 55 });

export default function JobBuilder() {
  const navigate = useNavigate();
  const [step, setStep] = useState("identity");
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "Remote — Global",
    employment: "Full-time",
    salary_min: "",
    salary_max: "",
    requirements: [defaultRequirement()],
    evidenceExpectations: "",
  });
  const [saving, setSaving] = useState(false);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const addReq = () => setForm((f) => ({ ...f, requirements: [...f.requirements, defaultRequirement()] }));
  const removeReq = (idx) => setForm((f) => ({ ...f, requirements: f.requirements.filter((_, i) => i !== idx) }));
  const updateReq = (idx, key, value) =>
    setForm((f) => ({ ...f, requirements: f.requirements.map((r, i) => (i === idx ? { ...r, [key]: value } : r)) }));

  const submit = async () => {
    setSaving(true);
    try {
      await jobApi.create({ ...form, salary_min: Number(form.salary_min) || null, salary_max: Number(form.salary_max) || null });
      toast.success("Job created — matches will generate once the matching service is live.");
      navigate("/jobs", { replace: true });
    } catch (err) {
      toast.error("Couldn't publish the job. The backend may not accept requests yet.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <button
          type="button"
          onClick={() => navigate("/jobs")}
          className="mb-4 inline-flex items-center gap-1.5 rounded text-meta font-medium text-ink-muted transition-colors hover:text-intel focus-visible:outline-none"
        >
          <ArrowLeft size={14} aria-hidden="true" /> Jobs
        </button>
        <PageHeader
          eyebrow="Requirement definition"
          title="Create a job"
          description="Define the proof-graph shape you're looking for. Weights control how heavily each capability moves the match score — the system answers 'why is this candidate ranked here?' using exactly what you set now."
        />
      </div>

      <Tabs
        value={step}
        onChange={setStep}
        items={[
          { value: "identity", label: "1 · Identity" },
          { value: "requirements", label: "2 · Requirements" },
          { value: "evidence", label: "3 · Evidence" },
          { value: "review", label: "4 · Review" },
        ]}
        className="overflow-x-auto"
      />

      {/* Step 1 */}
      <TabPanel value="identity" defaultValue="identity">
        <Card>
          <Card.Content className="max-w-2xl">
            <div className="flex flex-col gap-5">
              <Input label="Role title" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Senior Backend Engineer — Payments Infrastructure" required />
              <div>
                <label className="text-body-sm font-medium text-ink-hi">Role description</label>
                <p className="mb-1.5 text-meta text-ink-muted">Describe what this person will own and why it matters — candidates will see this on their opportunity view.</p>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-line-subtle bg-surface-1 px-3 py-2.5 text-body-sm text-ink-hi focus:border-intel focus:outline-none"
                  placeholder="Own core money-movement services. Design APIs that other teams build on and keep p99s flat during spikes."
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Location" value={form.location} onChange={(e) => update("location", e.target.value)} />
                <Input label="Employment" value={form.employment} onChange={(e) => update("employment", e.target.value)} />
                <Input label="Salary min" type="number" value={form.salary_min} onChange={(e) => update("salary_min", e.target.value)} />
                <Input label="Salary max" type="number" value={form.salary_max} onChange={(e) => update("salary_max", e.target.value)} />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep("requirements")}>Next: requirements</Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      </TabPanel>

      {/* Step 2 — requirements */}
      <TabPanel value="requirements" defaultValue="identity">
        <p className="mb-4 text-body-sm text-ink-muted">
          Every requirement becomes an edge in the candidate's proof graph — the system traces how evidence builds capability that satisfies your weight. Adjust the sliders to reflect what actually matters, not what reads well on paper.
        </p>
        <Card>
          <Card.Content className="space-y-6">
            {form.requirements.map((req, i) => (
              <div key={i} className="grid grid-cols-1 gap-4 rounded-lg border border-line-subtle bg-surface-1/50 p-4 sm:grid-cols-[12rem_1fr_1fr_auto] sm:items-start">
                <Input
                  label="Skill / capability"
                  value={req.skill}
                  onChange={(e) => updateReq(i, "skill", e.target.value)}
                  placeholder="Distributed Systems"
                />
                <div>
                  <label className="text-body-sm font-medium text-ink-hi">
                    Weight <span className="numeric font-mono text-micro text-ink-faint">{Number(req.weight).toFixed(2)}</span>
                  </label>
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={req.weight}
                    onChange={(e) => updateReq(i, "weight", Number(e.target.value))}
                    className="mt-2 w-full accent-[hsl(var(--ph-intel))]"
                    aria-label={`Weight for ${req.skill || "requirement"}: ${req.weight}`}
                  />
                  <p className="mt-0.5 text-micro text-ink-faint">How much this requirement moves the match score.</p>
                </div>
                <div>
                  <label className="text-body-sm font-medium text-ink-hi">
                    Min confidence <span className="numeric font-mono text-micro text-ink-faint">{req.minConfidence}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={req.minConfidence}
                    onChange={(e) => updateReq(i, "minConfidence", Number(e.target.value))}
                    className="mt-2 w-full accent-[hsl(var(--ph-verified))]"
                    aria-label={`Minimum confidence for ${req.skill || "requirement"}: ${req.minConfidence}%`}
                  />
                  <p className="mt-0.5 text-micro text-ink-faint">Below this, the match reason calls it out as a gap.</p>
                </div>
                {form.requirements.length > 1 && (
                  <button type="button" onClick={() => removeReq(i)} className="mt-5 rounded p-2 text-ink-faint transition-colors hover:bg-surface-2 hover:text-danger focus-visible:outline-none" aria-label="Remove requirement">
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <Button variant="ghost" onClick={addReq} leadingIcon={<Plus size={15} />}>Add requirement</Button>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setStep("evidence")}>Next: evidence expectations</Button>
            </div>
          </Card.Content>
        </Card>
      </TabPanel>

      {/* Step 3 — evidence expectations */}
      <TabPanel value="evidence" defaultValue="identity">
        <Card>
          <Card.Content className="max-w-2xl">
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-intel/20 bg-intel-soft/25 px-3.5 py-3">
              <ShieldCheck size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-intel" />
              <p className="text-body-sm leading-relaxed text-ink-muted">
                Evidence expectations tell candidates what verification bar you'll hold them to — transparent hiring
                starts here. The system shows gaps when a profile's evidence is thinner than this bar.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-body-sm font-medium text-ink-hi">What evidence do you expect?</label>
                <p className="mb-1.5 text-meta text-ink-muted">Describe what "good proof" looks like for this role — this text appears in the opportunity view for candidates.</p>
                <textarea
                  value={form.evidenceExpectations}
                  onChange={(e) => update("evidenceExpectations", e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-line-subtle bg-surface-1 px-3 py-2.5 text-body-sm text-ink-hi focus:border-intel focus:outline-none"
                  placeholder="At least one verified repository or merged-contribution trail touching messaging or service-to-service protocols. Assessments accepted for skills without public artifacts."
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep("review")}>Next: review</Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      </TabPanel>

      {/* Step 4 — review */}
      <TabPanel value="review" defaultValue="identity">
        <Card>
          <Card.Header><Card.Title>Review before publishing</Card.Title></Card.Header>
          <Card.Content>
            <div className="space-y-5 text-body-sm text-ink-muted">
              <div>
                <p className="text-micro font-medium uppercase tracking-caps text-intel">Identity</p>
                <p className="mt-1 text-ink-hi font-medium">{form.title || <span className="text-caution">Missing title</span>}</p>
                <p className="mt-0.5 text-meta text-ink-faint">{form.location} · {form.employment} · {form.salary_min && form.salary_max ? `${form.currency || "€"}${Number(form.salary_min).toLocaleString()}–${Number(form.salary_max).toLocaleString()}` : "salary TBD"}</p>
              </div>
              <div>
                <p className="text-micro font-medium uppercase tracking-caps text-intel">Requirements ({form.requirements.length})</p>
                <ul role="list" className="mt-1.5 flex flex-wrap gap-1.5">
                  {form.requirements.map((r, i) => (
                    <li key={i} className="rounded border border-line-subtle bg-surface-2/60 px-2 py-0.5 text-mono text-micro text-ink-hi">
                      {r.skill || "Unnamed"} ×{Number(r.weight).toFixed(2)} · min {r.minConfidence}%
                    </li>
                  ))}
                </ul>
                {form.requirements.some((r) => !r.skill) && <p className="mt-1.5 text-micro text-caution">Some requirements are unnamed — rename them before publishing.</p>}
              </div>
              {form.evidenceExpectations && (
                <div>
                  <p className="text-micro font-medium uppercase tracking-caps text-intel">Evidence expectations</p>
                  <p className="mt-1 text-meta leading-relaxed text-ink-muted">{form.evidenceExpectations}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-2.5">
              <Button variant="secondary" onClick={() => setStep("identity")}>Edit</Button>
              <Button loading={saving} onClick={submit}>Publish job</Button>
            </div>
          </Card.Content>
        </Card>
      </TabPanel>
    </div>
  );
}
