export const space = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48];

export function spacing(token) {
  const index = typeof token === "string" ? Number(token.replace("spacing-", "")) : token;
  return `${space[index] || 0}px`;
}
