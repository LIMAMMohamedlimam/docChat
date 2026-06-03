const WORDS_PER_TOKEN = 0.75;

function tokensToWords(tokens: number): number {
  return Math.ceil(tokens / WORDS_PER_TOKEN);
}

export function chunkText(
  text: string,
  maxTokens = 1000,
  overlapTokens = 200
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const maxWords = tokensToWords(maxTokens);
  const overlapWords = tokensToWords(overlapTokens);
  const stepWords = maxWords - overlapWords;

  const chunks: string[] = [];
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + maxWords, words.length);
    chunks.push(words.slice(start, end).join(" "));
    if (end === words.length) break;
    start += stepWords;
  }

  return chunks;
}
