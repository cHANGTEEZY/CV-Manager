# CV Manager

A web application to manage the complete recruitment pipeline — from collecting CVs to interview tracking, assessments, and offer letter generation.

## ✨ Features

### 1. CV Collection & Segregation

- Upload CVs (PDF, DOC, or image format — up to 10MB).
- Add candidate information manually:
  - Name
  - Phone
  - Email
  - References
  - Technology (e.g., .NET, React JS, DevOps, QA, etc.)
  - Level (Junior, Mid, Senior)
  - Salary Expectation
  - Experience
- Search dashboard with filters by name, technology, or interview status.

### 2. Application Tracking

- View the full CV and candidate details.
- Track current status:
  - Shortlisted
  - First Interview Complete
  - Second Interview Complete
  - Hired
  - Rejected
  - Blacklisted

### 3. Assessment Uploader

- Upload and assign assessments to candidates.

### 4. Assessment & Evaluation

- Add assessment results and behavioral evaluations directly to the candidate’s profile.
- Include remarks and test evaluations.

### 5. Offer Management

- Automatically generate offer letters for selected candidates.
- Upload draft templates and manage offer content.

### 6. Interview Scheduling

- Set interview date and time.
- Include reminders and scheduling interface.

---

## 🛠 Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS + ShadCN UI
- **Routing**: React Router v7
- **Backend & Storage**: [Supabase](https://supabase.com/)
  - PostgreSQL for Database
  - Supabase Storage for CV Uploads
  - Supabase Auth (OAuth with Google)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/cv-manager.git
cd cv-manager
```

### 2. Install dependencies

```bash
pnpm i
```

### 3. Environment setup

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server

```bash
pnpm run dev
```
