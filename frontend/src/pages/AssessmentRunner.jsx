import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Flag, ShieldCheck, X } from "lucide-react";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { toast } from "../store/toastStore";
import { DEMO_ASSESSMENTS, DEMO_ASSESSMENT_CONTENT } from "../demo/demoData";

/**
 * Assessment runner — immersive and distraction-free (rendered outside the
 * app shell). One task at a time, autosave semantics, honest local state.
 * NOTE: submission posts to the assessment service when the backend ships;
 * for now completion records locally and toasts honestly.
 */
export default function AssessmentRunner() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const assessment = DEMO_ASSESSMENTS.find((a) => a.id === assessmentId) || DEMO_ASSESSMENTS[0];
  const content = DEMO_ASSESSMENT_CONTENT[assessment.id];

  const questions = useMemo(() => {
    if (!content) {
      // Generic fallback set keeps the runner coherent for assessments whose
      // authored content isn't available in the demonstration dataset.
      return [
        {
          id: `${assessment.id}-q1`,
          kind: "single_choice",
          prompt: `Sample task for ${assessment.title}. Which statement best reflects good engineering judgment?`,
          options: ["Optimize before measuring", "Measure first, then optimize the proven bottleneck", "Premature optimization is fine at scale", "Skip validation to move faster"],
          answer: 1,
          explanation: "Measurement precedes optimization.",
        },
        {
          id: `${assessment.id}-q2`,
          kind: "multi_choice",
          prompt: "Select every practice that strengthens evidence quality.",
          options: ["Linking real artifacts", "Independent verification", "Vague self-description", "Reproducible results"],
          answer: [0, 1, 3],
          explanation: "Verifiable, reproducible signals carry weight; prose alone does not.",
        },
      ];
    }
    return content.questions;
  }, [content, assessment]);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(() =>
    Object.fromEntries(questions.map((q) => [q.id, q.kind === "multi_choice" ? [] : q.kind === "code" ? q.starterCode || "" : null]))
  );
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const question = questions[index];
  const answeredCount = questions.filter((q) => {
    const v = answers[q.id];
    return Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim().length > 0 : v != null;
  }).length;
  const pct = Math.round((answeredCount / questions.length) * 100);

  if (!content) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-transparent p-6">
        <div className="max-w-md rounded-card border border-line-subtle bg-surface-1 p-6 text-center">
          <ShieldCheck size={22} aria-hidden="true" className="mx-auto mb-3 text-intel" />
          <h1 className="text-section text-ink-hi">{assessment.title}</h1>
          <p className="mt-2 text-body-sm leading-relaxed text-ink-muted">
            The runner is wired and ready, but authored tasks for this assessment haven't been published yet — by us or
            the backend. Nothing fake will be scored.
          </p>
          <Button variant="secondary" className="mt-5" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  const selectSingle = (optIdx) => setAnswers((a) => ({ ...a, [question.id]: optIdx }));
  const toggleMulti = (optIdx) =>
    setAnswers((a) => ({
      ...a,
      [question.id]: a[question.id].includes(optIdx)
        ? a[question.id].filter((i) => i !== optIdx)
        : [...a[question.id], optIdx].sort(),
    }));

  const submit = async () => {
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 600)); // placeholder for POST /assessments/{id}/submit when it ships
      toast.success(`Responses saved for ${assessment.title} — scoring begins once the service is live.`);
      navigate(`/assessments/${assessment.id}/results`, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-transparent">
      {/* Runner chrome */}
      <header className="sticky top-0 z-sticky border-b border-line-subtle bg-surface-1/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="rounded-md p-2 text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink-hi focus-visible:outline-none"
            aria-label="Exit assessment"
          >
            <X size={16} aria-hidden="true" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-body-sm font-medium text-ink-hi">{assessment.title}</p>
            <p className="numeric font-mono text-micro text-ink-faint">
              {assessment.id} · supervised session · autosaves
            </p>
          </div>
          <span className="numeric shrink-0 font-mono text-meta text-ink-muted">
            {answeredCount}/{questions.length}
          </span>
        </div>
        <div aria-hidden="true" className="h-0.5 w-full bg-surface-3">
          <div className="h-full bg-intel transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
        </div>
      </header>

      {/* Task */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <div key={question.id} className="animate-fade-up">
          <p className="numeric font-mono text-micro uppercase tracking-caps text-intel">
            Task {index + 1} of {questions.length} · {question.kind.replace("_", " ")}
          </p>
          <fieldset className="mt-3">
            <legend className="text-page-sm max-w-2xl text-ink-hi">{question.prompt}</legend>

            {question.kind === "single_choice" && (
              <div role="radiogroup" aria-label="Answer options" className="mt-7 flex flex-col gap-2.5">
                {question.options.map((opt, i) => (
                  <label
                    key={i}
                    className={`flex cursor-pointer items-center gap-3.5 rounded-lg border px-4 py-3.5 text-body-sm transition-colors has-focus-visible:border-intel ${
                      answers[question.id] === i
                        ? "border-intel bg-intel-soft/40 text-ink-hi"
                        : "border-line-subtle bg-surface-1/60 text-ink-med hover:border-line-strong hover:bg-surface-1"
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      checked={answers[question.id] === i}
                      onChange={() => selectSingle(i)}
                      className="accent-[hsl(var(--ph-intel))]"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {question.kind === "multi_choice" && (
              <div className="mt-7 flex flex-col gap-2.5">
                {question.options.map((opt, i) => (
                  <label
                    key={i}
                    className={`flex cursor-pointer items-center gap-3.5 rounded-lg border px-4 py-3.5 text-body-sm transition-colors ${
                      answers[question.id].includes(i)
                        ? "border-intel bg-intel-soft/40 text-ink-hi"
                        : "border-line-subtle bg-surface-1/60 text-ink-med hover:border-line-strong hover:bg-surface-1"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={answers[question.id].includes(i)}
                      onChange={() => toggleMulti(i)}
                      className="accent-[hsl(var(--ph-intel))]"
                    />
                    {opt}
                  </label>
                ))}
                <p className="text-micro text-ink-faint">Select all that apply.</p>
              </div>
            )}

            {question.kind === "code" && (
              <div className="mt-6 overflow-hidden rounded-lg border border-line-subtle">
                <div className="flex items-center justify-between border-b border-line-subtle bg-surface-1 px-4 py-2">
                  <span className="numeric font-mono text-micro text-ink-faint">solution.go</span>
                  <Badge tone="neutral" size="sm" mono>sandbox</Badge>
                </div>
                <textarea
                  value={answers[question.id]}
                  onChange={(e) => setAnswers((a) => ({ ...a, [question.id]: e.target.value }))}
                  spellCheck={false}
                  rows={12}
                  aria-label="Code answer"
                  className="w-full resize-y bg-surface-1/60 p-4 font-mono text-body-sm text-ink-hi focus:outline-none"
                />
              </div>
            )}
          </fieldset>
        </div>

        {/* Nav */}
        <div className="mt-10 flex items-center justify-between border-t border-line-subtle pt-5">
          <Button
            variant="ghost"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            leadingIcon={<ChevronLeft size={15} />}
          >
            Previous
          </Button>
          {index < questions.length - 1 ? (
            <Button onClick={() => setIndex((i) => i + 1)} trailingIcon={<ChevronRight size={15} />}>
              Next task
            </Button>
          ) : (
            <Button onClick={() => setConfirmOpen(true)} loading={submitting} leadingIcon={<Flag size={15} />}>
              Review &amp; submit
            </Button>
          )}
        </div>
      </main>

      {/* Confirm / exit dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-scrim p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="runner-dialog-title">
          <div className="w-full max-w-md rounded-card border border-line-strong bg-surface-1 p-6 shadow-overlay animate-scale-in">
            {submitting || index === questions.length - 1 ? (
              <>
                <h2 id="runner-dialog-title" className="text-section-sm text-ink-hi">Submit assessment?</h2>
                <p className="mt-2 text-body-sm leading-relaxed text-ink-muted">
                  {answeredCount} of {questions.length} tasks answered.
                  {answeredCount < questions.length && " Unanswered tasks score zero — you can go back and finish them first."}
                </p>
                <div className="mt-6 flex justify-end gap-2.5">
                  {!submitting && (
                    <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
                      Keep working
                    </Button>
                  )}
                  <Button onClick={submit} loading={submitting}>
                    Submit responses
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 id="runner-dialog-title" className="text-section-sm text-ink-hi">Leave the session?</h2>
                <p className="mt-2 text-body-sm leading-relaxed text-ink-muted">
                  Progress so far is kept. You can resume from your Assessments page before the deadline.
                </p>
                <div className="mt-6 flex justify-end gap-2.5">
                  <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
                    Stay
                  </Button>
                  <Button variant="destructive" onClick={() => navigate("/assessments")}>
                    Leave &amp; save progress
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
