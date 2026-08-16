export function summarizeEvidence(evidence = []) {
  return evidence.reduce(
    (acc, item) => {
      acc.byType[item.type] = (acc.byType[item.type] || 0) + 1;
      acc.total += 1;
      return acc;
    },
    { total: 0, byType: {} }
  );
}
