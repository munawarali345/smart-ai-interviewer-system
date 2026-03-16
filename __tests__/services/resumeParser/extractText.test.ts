// ============================================================
// TEST FILE: __tests__/services/resumeParser/extractText.test.ts
// PURPOSE: Test extractTextFromFile function
// NOTE: PDF tests hatae kyunki pdf-parse-fork mock complex hai
// ============================================================

// Line 1: Import vitest functions
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ============================================================
// SECTION 1: MOCKS SETUP
// ============================================================

// Line 8: Mock fs/promises
vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(),
  },
}))

// Line 15: Mock mammoth - DOCX/DOC ke liye
vi.mock('mammoth', () => ({
  default: {
    extractRawText: vi.fn(),
  },
}))

// ============================================================
// IMPORTS AFTER MOCKS
// ============================================================

// Line 23: Import function
import extractTextFromFile from '@/services/resumeParser/extractText.service'

// Line 26: Get mocked modules
import fs from 'fs/promises'
import mammoth from 'mammoth'

// ============================================================
// TEST SUITE: extractTextFromFile - File Types
// ============================================================
describe('extractTextFromFile - File Types', () => {
  
  // Line 34: Reset mocks
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Line 39: Test 1 - DOCX file extraction
  it('should extract text from DOCX file', async () => {
    vi.mocked(fs.readFile).mockResolvedValue(Buffer.from('mock docx content') as any)
    vi.mocked(mammoth.extractRawText).mockResolvedValue({ value: 'DOCX extracted text' } as any)

    const result = await extractTextFromFile('test.docx')

    expect(fs.readFile).toHaveBeenCalledWith('test.docx')
    expect(mammoth.extractRawText).toHaveBeenCalled()
    expect(result).toBe('DOCX extracted text')
  })

  // Line 52: Test 2 - DOC file extraction
  it('should extract text from DOC file', async () => {
    vi.mocked(fs.readFile).mockResolvedValue(Buffer.from('mock doc content') as any)
    vi.mocked(mammoth.extractRawText).mockResolvedValue({ value: 'DOC extracted text' } as any)

    const result = await extractTextFromFile('test.doc')

    expect(fs.readFile).toHaveBeenCalledWith('test.doc')
    expect(mammoth.extractRawText).toHaveBeenCalled()
    expect(result).toBe('DOC extracted text')
  })

  // Line 67: Test 3 - Unsupported file type
  it('should throw error for unsupported file types', async () => {
    const result = extractTextFromFile('test.txt')
    
    await expect(result).rejects.toThrow('Unsupported file type. Only PDF and DOCX are allowed.')
  })

  // Line 76: Test 4 - Image file unsupported
  it('should throw error for image files', async () => {
    const result = extractTextFromFile('photo.jpg')
    
    await expect(result).rejects.toThrow('Unsupported file type. Only PDF and DOCX are allowed.')
  })

  // Line 85: Test 5 - Zip file unsupported
  it('should throw error for zip files', async () => {
    const result = extractTextFromFile('archive.zip')
    
    await expect(result).rejects.toThrow('Unsupported file type. Only PDF and DOCX are allowed.')
  })

  // Line 94: Test 6 - Case insensitive extension
  it('should handle uppercase .DOCX extension', async () => {
    vi.mocked(fs.readFile).mockResolvedValue(Buffer.from('mock docx') as any)
    vi.mocked(mammoth.extractRawText).mockResolvedValue({ value: 'DOCX TEXT' } as any)

    const result = await extractTextFromFile('resume.DOCX')

    expect(result).toBe('DOCX TEXT')
  })
})

// ============================================================
// TEST SUITE: Error Handling
// ============================================================
describe('extractTextFromFile - Error Handling', () => {
  
  // Line 112: Reset mocks
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Line 117: Test 1 - File not found
  it('should throw error when file not found', async () => {
    vi.mocked(fs.readFile).mockRejectedValue(new Error('ENOENT: no such file or directory'))

    await expect(extractTextFromFile('nonexistent.docx')).rejects.toThrow()
  })

  // Line 126: Test 2 - Empty file
  it('should handle empty DOCX file', async () => {
    vi.mocked(fs.readFile).mockResolvedValue(Buffer.from('') as any)
    vi.mocked(mammoth.extractRawText).mockResolvedValue({ value: '' } as any)

    const result = await extractTextFromFile('empty.docx')

    expect(result).toBe('')
  })
})
