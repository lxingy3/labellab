export const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "how",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "them",
  "to",
  "was",
  "with",
]);

export function tokenize(text, useBigrams = true) {
  const words = (text.toLowerCase().match(/[a-z0-9]+/g) || []).filter(
    (token) => !STOPWORDS.has(token)
  );
  if (!useBigrams) return words;

  const bigrams = [];
  for (let index = 0; index < words.length - 1; index += 1) {
    bigrams.push(`${words[index]} ${words[index + 1]}`);
  }
  return [...words, ...bigrams];
}
