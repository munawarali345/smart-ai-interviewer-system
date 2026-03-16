# AI-Powered Interview System 🤖🎤

> Ek smart interview system jahan AI candidate ka resume parse karta hai, questions generate karta hai, aur answers evaluate karta hai.

**GitHub Repository:** https://github.com/munawarali345/smart-ai-interviewer-system.git

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Project Structure](#project-structure)
5. [How It Works](#how-it-works)
6. [API Endpoints](#api-endpoints)
7. [Installation Guide](#installation-guide)
8. [Package Details](#package-details)
9. [Environment Variables](#environment-variables)

---

## 📖 Overview

Yeh ek AI-powered interview system hai jo automated technical interviews conduct karta hai. System candidate ka resume upload karne ke baad, AI se questions generate karta hai, candidate ke answers evaluate karta hai, aur feedback provide karta hai.

### Flow:
1. **Resume Upload** → Candidate PDF resume upload karta hai
2. **Text Extraction** → System PDF se text extract karta hai
3. **Interview Start** → AI resume ke basis pe question generate karta hai
4. **Answer Submission** → Candidate answer deta hai
5. **AI Evaluation** → AI answer evaluate karta hai (score + feedback)
6. **Next Question** → AI candidate ki performance ke hisab se next question generate karta hai
7. **Completion** → 5 questions ke baad interview complete hoti hai

---

## 🛠 Tech Stack

| Technology | Purpose | Why Used? |
|------------|---------|-----------|
| **Next.js 14** | Full-stack framework | Server-side rendering, API routes, aur modern React features |
| **TypeScript** | Language | Type safety - errors runtime ke bajaye compile time pe milte hain |
| **MongoDB** | Database | Flexible schema, easy to scale, JSON-like documents |
| **Mongoose** | ODM | MongoDB ke saath TypeScript-friendly aur schema validation |
| **Tailwind CSS** | Styling | Utility-first CSS - fast development |
| **Shadcn/UI** | UI Components | Beautiful, accessible components ready to use |
| **Winston** | Logging | Structured logging - file aur console me logs |
| **Grok AI** | AI/ML | Question generation aur answer evaluation ke liye |
| **Docker** | Containerization | Easy MongoDB setup, environment consistency |

---

## ✨ Features

- ✅ **Resume Upload** - PDF files support (PDF & DOCX)
- ✅ **AI Question Generation** - Resume ke basis pe relevant questions
- ✅ **Adaptive Difficulty** - Candidate ki performance ke hisab difficulty badalti hai
- ✅ **Answer Evaluation** - AI Evaluate aur feedback (score 0-10, quality: good/average/weak)
- ✅ **Progress Tracking** - Interview status track karta hai (in-progress/completed)
- ✅ **5-Question Interview** - Standard 5 questions per interview
- ✅ **MongoDB Indexes** - Fast queries ke liye (5 indexes)
- ✅ **Error Handling** - Proper validation aur error messages
- ✅ **Structured Logging** - Winston se file aur console logging
- ✅ **Zod Validation** - Environment variables ki validation

---

## 📁 Project Structure

```
interview-system/
│
├── app/                              # Next.js App Router (Frontend + API)
│   │
│   ├── api/                         # Backend API Routes
│   │   ├── interview/
│   │   │   ├── [id]/route.ts       # GET - Interview details laane ke liye
│   │   │   ├── start/route.ts      # POST - Naya interview start karein
│   │   │   └── answer/route.ts     # POST - Answer submit karein
│   │   └── resume/route.ts         # POST - Resume upload karein
│   │
│   ├── interview/[id]/              # Interview page (Frontend)
│   │   └── page.tsx
│   │
│   └── page.tsx                     # Home page (Frontend)
│
│
├── components/                       # React Components
│   ├── ResumeUpload.tsx             # Resume upload button aur form
│   ├── StartInterviewButton.tsx     # Start Interview button
│   ├── InterviewComponents/         # Interview UI parts
│   │   ├── AnswerForm.tsx          # Answer input form
│   │   └── InterviewClient.tsx      # Interview logic
│   └── ui/                         # Shadcn UI components
│       ├── button.tsx
│       ├── input.tsx
│       └── textarea.tsx
│
│
├── server/                          # Backend Code (Services & Models)
│   │
│   ├── lib/                        # Utility Functions
│   │   ├── db.ts                   # MongoDB connection handler
│   │   ├── logger.ts               # Winston logger setup
│   │   ├── fileUpload.ts           # File save/delete functions
│   │   ├── validateEnv.ts          # Environment validation (Zod)
│   │   ├── grokClient.ts           # Grok AI API client
│   │   │
│   │   ├── ai/                     # AI Functions
│   │   │   ├── grokinterview.ts    # Question generation logic
│   │   │   └── evaluateAnswer.ts   # Answer evaluation logic
│   │   │
│   │   └── api/
│   │       └── apiHelper.ts        # API helpers (frontend ke liye)
│   │
│   ├── models/                     # Mongoose Database Models
│   │   ├── candidate.ts            # Candidate schema (resume data)
│   │   └── interview.ts            # Interview schema (questions/answers)
│   │
│   └── services/                   # Business Logic
│       ├── interview.service.ts     # Interview start logic
│       ├── submitAnswer.ts         # Answer submit + evaluation logic
│       │
│       └── resumeParser/           # Resume Processing
│           ├── resume.service.ts   # Resume save entry point
│           ├── saveCandidate.service.ts # Database me candidate save
│           └── extractText.service.ts   # PDF/DOCX se text nikalna
│
│
├── lib/                            # Frontend Utilities
│   ├── utils.ts                    # cn() - Tailwind class merger
│   └── api/
│       └── apiHelper.ts            # Frontend API call helpers
│
│
├── types/                          # TypeScript Type Definitions
│   ├── interview.types.ts           # Interview interface
│   └── candidate.type.ts            # Candidate interface
│
│
├── docker/                         # Docker Configuration
│   ├── docker-compose.yml          # MongoDB container setup
│   └── dockerFile                  # Custom Dockerfile
│
│
├── uploads/                        # Uploaded Files Storage
│   └── resumes/                     # Resume PDFs yahan save hoti hain
│
│
├── config/                        # App Configuration
│   └── api.ts                     # API configuration
│
│
├── plans/                         # Project Planning
│   └── interview-system-plan.md   # Original plan document
│
│
└── __tests__/                     # Unit Tests
    ├── lib/
    │   └── fileUpload.test.ts
    └── services/
        └── resumeParser/
            └── extractText.test.ts
```

---

## 🔄 How It Works

### 1. Resume Upload Flow

```
User uploads PDF ──▶ Frontend sends FormData ──▶ /api/resume
                                                        │
                                                        ▼
                                            fileUpload.ts saves file
                                                        │
                                                        ▼
                                            extractText.service.ts
                                            (PDF/DOCX → Text)
                                                        │
                                                        ▼
                                            saveCandidate.service.ts
                                            (Save to MongoDB)
                                                        │
                                                        ▼
                                            Return candidateId to frontend
```

**Files Involved:**
- `app/api/resume/route.ts` - API endpoint
- `server/lib/fileUpload.ts` - File handling
- `server/services/resumeParser/extractText.service.ts` - Text extraction
- `server/services/resumeParser/saveCandidate.service.ts` - DB save
- `server/models/candidate.ts` - Mongoose model

---

### 2. Interview Start Flow

```
User clicks "Start Interview" ──▶ Frontend ──▶ /api/interview/start
                                                        │
                                                        ▼
                                            interview.service.ts
                                            │
                                            ├── 1. Find candidate by ID
                                            ├── 2. Call Grok AI for question
                                            │   (generateQuestion with resumeText)
                                            ├── 3. Create interview document
                                            └── 4. Return interviewId + question
                                                        │
                                                        ▼
                                            Frontend shows question
```

**Files Involved:**
- `app/api/interview/start/route.ts` - API endpoint
- `server/services/interview.service.ts` - Business logic
- `server/lib/ai/grokinterview.ts` - AI question generation
- `server/models/interview.ts` - Interview model

---

### 3. Answer Submission Flow

```
User submits answer ──▶ Frontend ──▶ /api/interview/answer
                                                   │
                                                   ▼
                                       submitAnswer.ts service
                                       │
                                       ├── 1. Find interview
                                       ├── 2. Save answer + timestamp
                                       ├── 3. PARALLEL AI calls:
                                       │   ├── evaluateAnswer() 
                                       │   │   (score, quality, feedback)
                                       │   └── generateQuestion()
                                       │       (next question)
                                       ├── 4. Update question with evaluation
                                       ├── 5. Check if 5 questions done
                                       │   ├── YES → status = "completed"
                                       │   └── NO → add next question
                                       └── 6. Save to DB
                                                   │
                                                   ▼
                                       Return next question OR completed
```

**Files Involved:**
- `app/api/interview/answer/route.ts` - API endpoint
- `server/services/submitAnswer.ts` - Main logic
- `server/lib/ai/evaluateAnswer.ts` - AI evaluation
- `server/lib/ai/grokinterview.ts` - Next question generation

---

## 🌐 API Endpoints

### 1. Resume Upload
```
POST /api/resume
Content-Type: multipart/form-data

Request:
  FormData:
    - resume: File (PDF or DOCX)

Response (Success):
  {
    "success": true,
    "message": "Resume uploaded successfully",
    "candidate": {
      "id": "507f1f77bcf86cd799439011",
      "resumeFile": "uploads/resumes/abc.pdf"
    }
  }

Response (Error):
  {
    "error": "No file uploaded"
  }
```

---

### 2. Start Interview
```
POST /api/interview/start
Content-Type: application/json

Request:
  {
    "candidateId": "507f1f77bcf86cd799439011"
  }

Response (Success):
  {
    "success": true,
    "data": {
      "interviewId": "507f1f77bcf86cd799439022",
      "question": "Tell me about your experience with React and TypeScript."
    }
  }

Response (Error):
  {
    "success": false,
    "message": "Invalid interview ID format"
  }
```

---

### 3. Submit Answer
```
POST /api/interview/answer
Content-Type: application/json

Request:
  {
    "interviewId": "507f1f77bcf86cd799439022",
    "answer": "I have 3 years of experience with React..."
  }

Response (Next Question):
  {
    "success": true,
    "data": {
      "question": "Can you explain hooks in React?",
      "completed": false
    }
  }

Response (Interview Complete):
  {
    "success": true,
    "data": {
      "completed": true,
      "message": "Interview Completed"
    }
  }

Response (Error):
  {
    "error": "Interview Not Found"
  }
```

---

### 4. Get Interview
```
GET /api/interview/[id]

Response:
  {
    "success": true,
    "data": {
      "_id": "507f1f77bcf86cd799439022",
      "candidateId": "507f1f77bcf86cd799439011",
      "resumeText": "Experienced React developer...",
      "questions": [
        {
          "questionText": "Tell me about React?",
          "answerText": "React is a library...",
          "difficulty": "easy",
          "answeredAt": "2024-01-15T10:30:00Z",
          "score": 8,
          "quality": "good",
          "nextDifficulty": "medium",
          "reason": "Good understanding shown"
        }
      ],
      "totalScore": 8,
      "status": "in-progress",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
```

---

## 🚀 Installation Guide

### Prerequisites Required:
| Software | Version | Download Link |
|----------|---------|----------------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| Docker Desktop | Latest | [docker.com](https://docker.com) |
| Git | Latest | [git-scm.com](https://git-scm.com) |

---

### Step 1: Clone the Project

```bash
# Open terminal and clone
git clone <your-repo-url>
cd interview-system
```

---

### Step 2: Install Dependencies

```powershell
# Install all npm packages (sab packages ek saath install honge)
npm install
```

**Yeh sab packages install honge:**

| Package | Version | Purpose | Kun Use Kiya? |
|---------|---------|---------|---------------|
| **Core** | | | |
| next | 16.1.6 | React framework | Server rendering, API routes |
| react | 19.2.3 | UI library | Component based UI |
| react-dom | 19.2.3 | React DOM | React rendering |

| **Database** | | | |
| mongoose | 9.2.3 | MongoDB ODM | Database operations |

| **AI** | | | |
| groq-sdk | 0.37.0 | Grok AI SDK | Question generation & evaluation |

| **File Processing** | | | |
| mammoth | 1.11.0 | DOCX parser | Word files se text |
| pdf-parse-fork | 1.2.0 | PDF parser | PDF files se text |


| **Utilities** | | | |
| winston | 3.19.0 | Logger | Structured logging |
| zod | 4.3.6 | Validator | Env validation |
| dotenv | 17.3.1 | Env loader | Environment variables |
| clsx | 2.1.1 | Class joiner | Conditional CSS |
| tailwind-merge | 3.5.0 | CSS merger | Tailwind classes |
| sonner | 2.0.7 | Toast notifications | User feedback |
| lucide-react | 0.575.0 | Icons | UI icons |

| **UI** | | | |
| tailwindcss | 4 | Styling | CSS framework |

| **Development** | | | |
| typescript | 5 | Type checking | Type safety |
| eslint | 9 | Linting | Code quality |
| vitest | 4.0.18 | Testing | Unit tests |

---

### Step 3: Setup MongoDB with Docker

```powershell
# Method 1: Only MongoDB (Recommended for local development)
# PowerShell me ye command chalao:
docker run -d --name ai_mongo -p 27017:27017 -v mongo_data:/data/db mongo:7

# Method 2: Using docker-compose (MongoDB + App)
cd docker

# just run mongo on docker
docker compose -f docker/docker-compose.yml up -d mongo

# Method 3: Manual Docker run (Bash/Linux)
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest

# Verify MongoDB is running
docker ps

# You should see:
# CONTAINER ID   IMAGE       COMMAND                  STATUS
# abc123         mongo:7     "docker-entrypoint.s…"   Up 2 minutes
```


```

**Why Docker?**
- MongoDB Docker me install karna easiest hai
- No manual installation required
- Works on Windows, Mac, Linux
- Easy to start/stop/remove

---

### Step 4: Environment Variables

```bash
# Create .env.local file in project root
# (Create this file - it doesn't exist yet)

MONGODB_URI=mongodb://localhost:27017/interview-system
GROK_API_KEY=your_grok_api_key_here
```

**Getting Grok API Key:**
1. Go to [x.ai](https://x.ai) or Grok dashboard
2. Create account
3. Generate API key
4. Copy to .env.local

---

### Step 5: Run the Application

```bash
# Development mode (recommended for development)
npm run dev

# Production build (for production)
npm run build
npm start
```

---

### Step 6: Verify Installation

```bash
# Open browser and visit
http://localhost:3000

# You should see the homepage!
```

---

## 📦 Package Details

| Package | Version | Purpose | Why Used? |
|---------|---------|---------|-----------|
| **next** | ^14.0.0 | React framework | SSR, API routes, file-based routing |
| **react** | ^18.0.0 | UI library | Component-based UI |
| **mongoose** | ^8.0.0 | MongoDB ODM | Type-safe DB operations |
| **mammoth** | ^1.6.0 | DOCX parser | Extract text from Word files |
| **pdf-parse-fork** | ^1.7.6 | PDF parser | Extract text from PDF files |
| **winston** | ^3.11.0 | Logger | Structured logging to file/console |
| **zod** | ^3.22.0 | Validator | Environment variable validation |
| **clsx** | ^2.0.0 | Class joiner | Conditional CSS classes |
| **tailwind-merge** | ^2.0.0 | CSS merger | Merge Tailwind classes |
| **lucide-react** | ^0.294.0 | Icons | Beautiful icons |
| **react-hook-form** | ^7.49.0 | Form handling | Easy form management |
| **@hookform/resolvers** | ^3.3.0 | Form validation | Zod + React Hook Form |

---

## 🔐 Environment Variables

| Variable | Required? | Description | Example |
|----------|-----------|-------------|---------|
| `MONGODB_URI` | ✅ Yes | MongoDB connection string | `mongodb://localhost:27017/interview-system` |
| `GROK_API_KEY` | ✅ Yes | Grok AI API key | `xai-xxxxxxxxxxxxxxxx` |

### Creating .env.local:

```bash
# Project root me .env.local create karein
MONGODB_URI=mongodb://localhost:27017/interview-system
GROK_API_KEY=your_actual_api_key_here
```

---

## 🎯 Key Technical Highlights

**Parallel AI Calls**: Answer evaluation aur next question generation ek saath hoti hai (50% faster)
- **Adaptive Difficulty**: AI candidate ki performance ke hisab se question difficulty badalta hai
- **Production Ready**: Structured logging, error handling, aur validation setup hai
- **TypeScript**: Full type safety for better developer experience

### 1. Parallel AI Calls (50% Faster)
```typescript
// Instead of waiting for one after another:
const evaluation = await evaluateAnswer(...);  // Wait 3-5 sec
const nextQuestion = await generateQuestion(...); // Wait 3-5 sec
// Total: 6-10 seconds

// We do both at the same time:
const [evaluation, nextQuestion] = await Promise.all([
    evaluateAnswer(...),
    generateQuestion(...)
]);
// Total: 3-5 seconds! 🚀
```

### 2. Adaptive Difficulty
- AI automatically adjusts question difficulty based on candidate's performance
- If score is good → increase difficulty
- If score is weak → decrease difficulty
- `nextDifficulty` field tracks this

### 3. Database Indexes (Fast Queries)
```typescript
// 5 indexes for optimal performance
InterviewSchema.index({ candidateId: 1 });        // Find by candidate
InterviewSchema.index({ status: 1 });              // Filter by status
InterviewSchema.index({ createdAt: -1 });          // Sort by date
InterviewSchema.index({ candidateId: 1, status: 1 }); // Combined
InterviewSchema.index({ completedAt: -1 });        // Find completed
```

### 4. Structured Logging
```typescript
// Instead of console.log
logger.info('Interview started', { candidateId });
logger.error('Error occurred', { error: error.message });
// Logs go to file + console with timestamps
```

---

## 📝 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Make sure Docker is running: `docker ps` |
| Grok API error | Check API key in .env.local |
| PDF not parsing | Make sure it's PDF or DOCX (not images) |
| Port 3000 in use | Run: `npx kill-port 3000` |
| Typescript errors | Run: `npm run build` to check |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License - Feel free to use this project for learning or commercial purposes.

---

## 👨‍💻 Author

**Munawar Ali**  
AI & Full-Stack Developer

---

## 🙏 Acknowledgments

- Next.js Team for the amazing framework
- MongoDB for the database
- Grok AI for the AI capabilities
- Shadcn for the beautiful UI components
