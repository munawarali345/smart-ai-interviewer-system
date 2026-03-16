// Type declaration for pdf-parse-fork module
// This module doesn't have TypeScript types, so we create our own

declare module 'pdf-parse-fork' {
  interface PdfParseResult {
    numpages: number;
    numrender: number;
    info: Record<string, unknown>;
    metadata: Record<string, unknown>;
    text: string;
    version: string;
  }

  function pdfParse(buffer: Buffer): Promise<PdfParseResult>;

  export default pdfParse;
}
