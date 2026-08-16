const flags = {
  skillGraph: true,
  evidenceV2: false,
  adaptiveAssessment: true,
};

export function isEnabled(flag) {
  return !!flags[flag];
}

export function getFlags() {
  return { ...flags };
}
