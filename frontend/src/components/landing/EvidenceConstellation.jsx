import { motion } from "framer-motion";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

const EVIDENCE = [
  { y: 82, label: "Repository", meta: "payments-core" },
  { y: 202, label: "Assessment", meta: "Algorithms · 91" },
  { y: 322, label: "Contributions", meta: "24 months active" },
];

const SKILLS = [
  { y: 74, label: "Python" },
  { y: 154, label: "FastAPI" },
  { y: 234, label: "PostgreSQL" },
  { y: 314, label: "Docker" },
];

const CONNECTIONS = [
  [232, 111, 326, 98],
  [232, 111, 326, 178],
  [232, 111, 326, 338],
  [232, 231, 326, 98],
  [232, 231, 326, 258],
  [232, 351, 326, 178],
  [232, 351, 326, 258],
  [232, 351, 326, 338],
  [474, 98, 602, 225],
  [474, 178, 602, 225],
  [474, 258, 602, 225],
  [474, 338, 602, 225],
];

const PROOF_PATH =
  "M232 231 C276 231 277 98 326 98 H474 C540 98 544 225 602 225 H818";

function DesktopConstellation({ reducedMotion }) {
  return (
    <motion.svg
      layout
      className="constellation-svg"
      viewBox="0 0 980 440"
      role="img"
      aria-labelledby="constellation-title constellation-description"
      initial={false}
      animate={{ y: reducedMotion ? 0 : [0, -3, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      <title id="constellation-title">Evidence constellation</title>
      <desc id="constellation-description">
        Repository, assessment and contribution evidence connect to verified
        skills, a backend capability and a 94 percent match.
      </desc>

      <g className="constellation-connections" aria-hidden="true">
        {CONNECTIONS.map(([x1, y1, x2, y2], index) => (
          <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
        <line x1="698" y1="225" x2="818" y2="225" />
        <path className="constellation-proof-path" d={PROOF_PATH} />
        {!reducedMotion && (
          <circle className="constellation-data-pulse" r="3">
            <animateMotion
              dur="5.6s"
              repeatCount="indefinite"
              path={PROOF_PATH}
            />
          </circle>
        )}
      </g>

      <g className="constellation-layer-labels" aria-hidden="true">
        <text x="28" y="38">EVIDENCE</text>
        <text x="326" y="38">VERIFIED SKILLS</text>
        <text x="602" y="148">CAPABILITY</text>
        <text x="818" y="170">MATCH</text>
      </g>

      <g className="constellation-nodes">
        {EVIDENCE.map(({ y, label, meta }) => (
          <g className="constellation-evidence-node" key={label}>
            <rect x="28" y={y} width="204" height="58" rx="7" />
            <circle className="constellation-status-dot" cx="47" cy={y + 22} r="3" />
            <text className="constellation-node-title" x="59" y={y + 25}>
              {label}
            </text>
            <text className="constellation-node-meta" x="59" y={y + 43}>
              {meta}
            </text>
          </g>
        ))}

        {SKILLS.map(({ y, label }) => (
          <g className="constellation-skill-node" key={label}>
            <rect x="326" y={y} width="148" height="48" rx="7" />
            <circle className="constellation-status-dot" cx="345" cy={y + 24} r="3" />
            <text className="constellation-node-title" x="358" y={y + 28}>
              {label}
            </text>
          </g>
        ))}

        <g className="constellation-capability">
          <circle className="constellation-radar-ring constellation-radar-outer" cx="650" cy="225" r="46" />
          <circle className="constellation-radar-ring" cx="650" cy="225" r="34" />
          <circle className="constellation-radar-center" cx="650" cy="225" r="4" />
          <text className="constellation-cap-label" x="650" y="229">CAP</text>
          <text className="constellation-cap-meta" x="650" y="294">BACKEND CAPABILITY</text>
        </g>

        <g className="constellation-match-node">
          <rect x="818" y="190" width="126" height="70" rx="8" />
          <text className="constellation-match-value" x="881" y="226">94</text>
          <text className="constellation-match-label" x="881" y="244">MATCH</text>
        </g>
      </g>
    </motion.svg>
  );
}

function MobileConstellation() {
  return (
    <div
      className="constellation-mobile"
      role="img"
      aria-label="Repositories, assessments and contributions support verified skills, which inform a backend capability and 94 match score."
    >
      <div className="constellation-mobile-evidence">
        <span>Repository <small>payments-core</small></span>
        <span>Assessment <small>Algorithms · 91</small></span>
        <span>Contributions <small>24 months active</small></span>
      </div>
      <div className="constellation-mobile-connector" aria-hidden="true">↓</div>
      <div className="constellation-mobile-skills">
        <span>Python</span>
        <span>FastAPI</span>
        <span>PostgreSQL</span>
        <span>Docker</span>
      </div>
      <div className="constellation-mobile-connector" aria-hidden="true">↓</div>
      <div className="constellation-mobile-outcome">
        <span className="constellation-mobile-cap">CAP <small>BACKEND CAPABILITY</small></span>
        <span className="constellation-mobile-match">94 <small>MATCH</small></span>
      </div>
    </div>
  );
}

export default function EvidenceConstellation() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      layout
      className="constellation-canvas"
      role="group"
      aria-label="Demonstration of evidence-to-capability matching"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 24 }}
    >
      <DesktopConstellation reducedMotion={reducedMotion} />
      <MobileConstellation />
    </motion.div>
  );
}
