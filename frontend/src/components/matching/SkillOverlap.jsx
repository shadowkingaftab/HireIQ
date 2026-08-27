import Badge from "../ui/Badge";

/**
 * Requirement-by-requirement overlap for one match: matched vs missing,
 * with requirement weights visible.
 */
export default function SkillOverlap({ job, match, className = "" }) {
  const profile = job?.requirementProfile || [];
  return (
    <ul role="list" className={`flex flex-col divide-y divide-line-subtle/60 ${className}`}>
      {profile.map((req) => {
        const has = match.matchedSkills?.includes(req.skill);
        const isMissing = match.missingSkills?.includes(req.skill);
        return (
          <li key={req.skill} className="flex items-center justify-between gap-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-body-sm text-ink-hi">{req.skill}</p>
              <p className="numeric text-micro text-ink-faint">
                weight ×{req.weight.toFixed(2)} · min confidence {req.minConfidence}
              </p>
            </div>
            {has && <Badge tone="success" size="sm" dot>matched</Badge>}
            {!has && isMissing && <Badge tone="danger" size="sm">not evidenced</Badge>}
            {!has && !isMissing && <Badge tone="neutral" size="sm">partial</Badge>}
          </li>
        );
      })}
    </ul>
  );
}
