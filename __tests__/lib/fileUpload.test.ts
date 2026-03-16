// ============================================================
// TEST FILE: __tests__/lib/fileUpload.test.ts
// PURPOSE: Test the saveFile function from lib/fileUpload.ts
// ============================================================

// Line 1: Import vitest functions for testing
// describe = test group banana ke liye
// it = ek individual test banana ke liye  
// expect = result check karne ke liye
// vi = vitest utilities (mocking ke liye)
import { describe, it, expect, vi } from 'vitest'

// Line 7: MOCK - Real file system ko fake karte hain
// Taake tests mein actual files disk pe save na hon
// Sirf 'default' export chahiye kyunki lib/fileUpload.ts mein "import fs from 'fs/promises'" hai
vi.mock('fs/promises', () => ({
  default: {
    mkdir: vi.fn().mockResolvedValue(undefined),
    writeFile: vi.fn().mockResolvedValue(undefined),
  },
}))

// Line 9: Test suite start - saveFile function ke liye
describe('saveFile', () => {
  
  // Line 12: Helper function - Test ke liye fake file create karta hai
  // Isse har test mein file create karna asaan ho jata hai
  const createMockFile = (
    type: string,      // File ka type (PDF, DOC, etc)
    size: number,      // File ka size bytes mein
    name: string = 'test.pdf'  // File ka naam (default: test.pdf)
  ) => ({
    type,              // File type
    size,              // File size
    name,              // File name
    // arrayBuffer - file se data read karne ke liye
    // Mock kiya hai taake real file na read kare
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(size)),
  })
  
  // ============================================================
  // SECTION 1: FILE TYPE VALIDATION TESTS
  // Purpose: Check karna ke kaunse files allow hain
  // ============================================================
  describe('File Type Validation', () => {
    
    // Line 20: Test 1 - PDF file allow hai?
    // 'async' matlab ye function asynchronous hai
    // 'await' matlab code is line tak rukega jab tak function complete na ho
    it('should accept PDF files', async () => {
      // Dynamic import - saveFile function ko import karte hain
      const { saveFile } = await import('@/lib/fileUpload')
      
      // Mock file create karte hain - PDF type, 1000 bytes
      const file = createMockFile('application/pdf', 1000)
      
      // Expect karte hain ke function chal jaye (koi error na aaye)
      await expect(saveFile(file as any)).resolves.toBeDefined()
    })
    
    // Line 28: Test 2 - DOC file allow hai?
    it('should accept DOC files', async () => {
      const { saveFile } = await import('@/lib/fileUpload')
      const file = createMockFile('application/msword', 1000, 'test.doc')
      
      await expect(saveFile(file as any)).resolves.toBeDefined()
    })
    
    // Line 35: Test 3 - DOCX file allow hai?
    it('should accept DOCX files', async () => {
      const { saveFile } = await import('@/lib/fileUpload')
      const file = createMockFile('application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1000, 'test.docx')
      
      await expect(saveFile(file as any)).resolves.toBeDefined()
    })
    
    // Line 42: Test 4 - Image file reject hoga?
    it('should reject image files', async () => {
      const { saveFile } = await import('@/lib/fileUpload')
      const file = createMockFile('image/jpeg', 1000, 'test.jpg')
      
      // Expect karte hain ke error throw ho message ke saath
      await expect(saveFile(file as any)).rejects.toThrow('Only PDF / DOC / DOCX files allowed')
    })
    
    // Line 49: Test 5 - Text file reject hoga?
    it('should reject text files', async () => {
      const { saveFile } = await import('@/lib/fileUpload')
      const file = createMockFile('text/plain', 1000, 'test.txt')
      
      await expect(saveFile(file as any)).rejects.toThrow('Only PDF / DOC / DOCX files allowed')
    })
    
    // Line 56: Test 6 - Zip file reject hoga?
    it('should reject zip files', async () => {
      const { saveFile } = await import('@/lib/fileUpload')
      const file = createMockFile('application/zip', 1000, 'test.zip')
      
      await expect(saveFile(file as any)).rejects.toThrow('Only PDF / DOC / DOCX files allowed')
    })
  })
  
  // ============================================================
  // SECTION 2: FILE SIZE VALIDATION TESTS
  // Purpose: Check karna ke file size limit kaam karti hai
  // ============================================================
  describe('File Size Validation', () => {
    
    // Line 65: Test 7 - 5MB se bada file reject?
    it('should reject files larger than 5MB', async () => {
      const { saveFile } = await import('@/lib/fileUpload')
      // 6MB = 6 * 1024 * 1024 bytes
      const file = createMockFile('application/pdf', 6 * 1024 * 1024)
      
      await expect(saveFile(file as any)).rejects.toThrow('File size must be less than 5MB')
    })
    
    // Line 73: Test 8 - Exactly 5MB file allow hai (kyunki code mein > use hua hai, >= nahi)
    // Code: if (file.size > MAX_FILE_SIZE) - strictly greater than
    // Isliye exactly 5MB allow hai, reject nahi
    it('should accept exactly 5MB files', async () => {
      const { saveFile } = await import('@/lib/fileUpload')
      // 5MB = 5 * 1024 * 1024 bytes
      const file = createMockFile('application/pdf', 5 * 1024 * 1024)
      
      await expect(saveFile(file as any)).resolves.toBeDefined()
    })
    
    // Line 81: Test 9 - 1MB file allow?
    it('should accept files smaller than 5MB', async () => {
      const { saveFile } = await import('@/lib/fileUpload')
      // 1MB = 1024 * 1024 bytes
      const file = createMockFile('application/pdf', 1024 * 1024)
      
      await expect(saveFile(file as any)).resolves.toBeDefined()
    })
    
    // Line 89: Test 10 - 4.9MB file allow?
    it('should accept files at 4.9MB', async () => {
      const { saveFile } = await import('@/lib/fileUpload')
      // 4.9MB
      const file = createMockFile('application/pdf', Math.floor(4.9 * 1024 * 1024))
      
      await expect(saveFile(file as any)).resolves.toBeDefined()
    })
  })
  
  // ============================================================
  // SECTION 3: FILE SAVE TESTS
  // Purpose: Check karna ke file correctly save hoti hai
  // ============================================================
  describe('File Save', () => {
    
    // Line 99: Test 11 - Unique filename generate hota hai?
    it('should generate unique filename with timestamp', async () => {
      const { saveFile } = await import('@/lib/fileUpload')
      const file = createMockFile('application/pdf', 1000, 'resume.pdf')
      
      // Function call karte hain aur result store karte hain
      const result = await saveFile(file as any)
      
      // Check karte hain ke result mein file ka naam hai
      expect(result).toContain('resume.pdf')
      // Check karte hain ke timestamp (-) present hai
      expect(result).toContain('-')
    })
    
    // Line 110: Test 12 - Correct folder mein save hota hai?
    it('should save file to uploads/resumes directory', async () => {
      const { saveFile } = await import('@/lib/fileUpload')
      const file = createMockFile('application/pdf', 1000)
      
      const result = await saveFile(file as any)
      
      // Check karte hain ke path mein uploads/resumes hai
      // Windows pe backslash (\\) use hota hai, Linux/Mac pe forward slash (/)
      // Isliye regex use karte hain jo donu handle kare
      expect(result).toMatch(/uploads[\\/]resumes/)
    })
  })
})
