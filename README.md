# 📇 CardAI Creator — Premium AI Digital Business Card Generator & Visitor Chatbot SaaS

> **A fully production-ready SaaS for designing, sharing, and chatting with digital business cards.** Built with Next.js (App Router), this application is a self-contained SaaS boilerplate complete with Google Authentication, database-backed card persistence, 5 pre-designed templates, real-time live iframe previews, Stripe credit purchases, and an interactive visitor-facing AI Chatbot Assistant clone.

## 🌐 Project Details

**GitHub Repository:** [github.com/SamurAIGPT/blogger-cms](https://github.com/SamurAIGPT/blogger-cms)  
*(Blogger CMS repository context)*

**Live Demo:** [ai-business-card-sites.easysite.ai](https://ai-business-card-sites.easysite.ai/)

---

CardAI Creator is a highly optimized SaaS application designed to help professionals, creators, and teams build interactive digital business cards. It features a modern layout designer, real-time preview, QR code sharing, and a floating AI chatbot widget that lets visitors ask questions to a digital clone of the card owner.

**Why use CardAI Creator?**

- **Production-Ready SaaS Boilerplate** — Configured with Google OAuth, PostgreSQL connection pooling, and Stripe Checkout.
- **AI Custom Layouts** — Enter prompts like *"make this look retro cyberpunk"* to generate custom Tailwind card styling using Gemini.
- **Interactive AI Clone Assistant** — Shared cards feature a chatbot widget. Visitors can ask questions (e.g. *"What is her email?"*, *"What are his core specialties?"*), resolved using the card's profile as LLM context.
- **Base64 Local Image Uploading** — Self-contained image selector converts avatars to base64 inline, saving directly to the PostgreSQL database without requiring complex external S3/Supabase storage integrations.
- **5 Premium Pre-designed Styles** — Classic Blue, Tech Dark, Gradient Glassmorphism, Vintage Serif, and Elegant Gold templates load instantly offline.
- **Automatic QR Codes** — Standard QR code generator overlay points directly to the card's public URL for quick mobile scanning.

![Blogger CMS & CardAI Dashboard](https://cdn.muapi.ai/data/2/319300472208/Screenshot_2026-05-25_113551.png)

---

## ✨ Core Features

### 🧠 AI Card Customizer
- Enter custom style prompts. The system calls Gemini LLM via MuAPI and engineers a tailored Tailwind CSS component layout.
- Cost: **5 credits** per generation.
- Polled asynchronously with spinner overlays while the design compiling runs in the background.

### 🤖 Visitor AI Clone Chatbot
- Visitors viewing the public `/card/[hash]` page can open a floating chat drawer.
- Answers questions about your experience, contact info, and website by referencing profile details.
- Runs a synchronous backend polling script so that visitors get instant, snappy answers.

### 📱 Responsive Previews
- Left sidebar for form parameters editing.
- Center/Right live viewport displaying updates in real-time inside a mobile device mock iframe to prevent styles leaking.

### 💳 Stripe Credit Billing (`/pricing`)
- Tiers: **Starter** ($10/100 credits), **Pro** ($25/300 credits), and **Business** ($50/750 credits).
- Balance is automatically updated upon checkout completion using Stripe webhooks.

---

## 🔑 Required Environment Variables

Configure these keys inside your local `.env` or production Vercel dashboard:

| Category              | Variable                             | Purpose & Source                                                                             |
| :-------------------- | :----------------------------------- | :------------------------------------------------------------------------------------------- |
| **Database**          | `DATABASE_URL`                       | PostgreSQL connection string ([Supabase](https://supabase.com) or [Neon](https://neon.tech)) |
|                       | `DIRECT_URL`                         | Direct DB connection for running Prisma migrations                                           |
| **NextAuth / Google** | `NEXTAUTH_SECRET`                    | Random secret string for signing auth tokens (`openssl rand -base64 32`)                     |
|                       | `NEXTAUTH_URL`                       | Local/production domain (e.g. `http://localhost:3001`)                                       |
|                       | `GOOGLE_CLIENT_ID`                   | Obtained from [Google Cloud Console Credentials](https://console.cloud.google.com/)          |
|                       | `GOOGLE_CLIENT_SECRET`               | Obtained from [Google Cloud Console Credentials](https://console.cloud.google.com/)          |
| **Stripe Billing**    | `STRIPE_SECRET_KEY`                  | Obtained from [Stripe API Keys](https://dashboard.stripe.com/apikeys)                        |
|                       | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Obtained from [Stripe API Keys](https://dashboard.stripe.com/apikeys)                        |
|                       | `STRIPE_WEBHOOK_SECRET`              | Configured webhook secret to resolve transaction credits                                     |
| **AI Generator**      | `MUAPIAPP_API_KEY`                   | AI API key from [muapi.ai](https://muapi.ai/)                                                |

---

## 🛠️ Local Development & Launch

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- A local or remote PostgreSQL database instance.

### Step-by-Step Setup

1. **Navigate to the App**
   ```bash
   cd apps/ai-business-card
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Variables**
   ```bash
   cp .env.example .env
   # Populate your active database, Stripe, and OAuth API keys
   ```

4. **Initialize DB Schema**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start Dev Server**
   ```bash
   npm run dev
   # Runs locally on http://localhost:3001
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```
