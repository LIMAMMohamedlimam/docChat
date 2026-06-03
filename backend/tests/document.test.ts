import { chunkText } from "../src/utils/chunk";

describe("chunkText", () => {
  it("returns empty array for empty string", () => {
    expect(chunkText("")).toEqual([]);
  });

  it("returns a single chunk when text is short", () => {
    const text = "hello world foo bar";
    const chunks = chunkText(text, 1000, 200);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe(text);
  });

  it("splits text into multiple overlapping chunks", () => {
    // 2000 words → should produce multiple chunks with 1000-token (~1333 word) windows
    const words = Array.from({ length: 2000 }, (_, i) => `word${i}`);
    const text = words.join(" ");
    const chunks = chunkText(text, 1000, 200);
    expect(chunks.length).toBeGreaterThan(1);
    // Each chunk should start with a word that also appears at the end of the previous chunk (overlap)
    for (let i = 1; i < chunks.length; i++) {
      const prevWords = chunks[i - 1].split(" ");
      const currWords = chunks[i].split(" ");
      // The first word of the current chunk must come from within the previous chunk
      expect(prevWords).toContain(currWords[0]);
    }
  });

  it("last chunk contains the last word", () => {
    const words = Array.from({ length: 3000 }, (_, i) => `w${i}`);
    const text = words.join(" ");
    const chunks = chunkText(text);
    const last = chunks[chunks.length - 1];
    expect(last).toContain("w2999");
  });
});
