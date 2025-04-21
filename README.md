# 🧑‍💼 HR Applicant Tracking System (ATS)

A full-featured web application designed for HR teams to **manage and track applicants**, **create interview events**, **send offer or rejection letters**, **view and manage all applicants**, and gain **insights through analytics** — all in one place.

---

## 🚀 Features

- 📋 **Applicant Management**  
  View detailed applicant profiles, contact candidates, and manage application status.

- 🗓️ **Event Scheduling**  
  Schedule technical and HR interviews, manage deadlines, and track event outcomes.

- 📂 **Assignment & Assessment Tracking**  
  Upload assignments, track submissions, and evaluate performance.

- 📧 **Send Offer/Rejection Letters**  
  Easily send templated offer or rejection emails directly from the platform.

- 📊 **Analytics Dashboard**  
  Gain insights into applicant conversion rates, assignment stats, and interview outcomes.

---

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Form Handling & Validation**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Backend as a Service**: [Supabase](https://supabase.com/)
- **Database**: SQL (PostgreSQL via Supabase)
- **File Storage**: AWS S3 for CVs, assessments, and offer letters

---


## ✅ Prerequisites

Before running the app, make sure you have the following installed and configured:

- [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/)
- [TypeScript](https://www.typescriptlang.org/) installed globally
- `.env` file created with your **Supabase Anon Key** and **URL**

### Example `.env` file

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```



## How to run the project

# 1. Clone the repository
git clone https://github.com/cHANGTEEZY/CV-Manager.git

# 2. Navigate to the frontend client folder
cd CV-Manager/client

# 3. Install dependencies
pnpm install

# 4. Run the development server
pnpm run dev
