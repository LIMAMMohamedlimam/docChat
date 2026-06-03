// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse") as (buffer: Buffer) => Promise<{ text: string }>;
import { parse as csvParse } from "csv-parse/sync";

export async function extractText(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === "application/pdf") {
    const data = await pdfParse(buffer);
    return data.text.trim();
  }

  if (mimeType === "text/csv") {
    const rows = csvParse(buffer, { skip_empty_lines: true }) as string[][];
    return rows.map((row) => row.join(", ")).join("\n");
  }

  // text/plain and fallback
  return buffer.toString("utf-8").trim();
}
