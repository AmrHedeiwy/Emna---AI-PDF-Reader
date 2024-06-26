## Getting Started

This is a repository for Emna - AI PDF Reader: Next.js 14, tRPC, TypeScript, Prisma & Tailwind

## Features

- 🛠️ Complete marketplace built from scratch in Next.js 14
- 💻 Beautiful Landing Page & Pricing Page Included
- 💳 Free & Pro Plan Using Stripe
- 📄 A Beautiful And Highly Functional PDF Viewer
- 🔄 Streaming API Responses in Real-Time
- 🔒 Authentication Using NextAuth
- 🎨 Clean, Modern UI Using Shadcn
- 🚀 Optimistic UI Updates for a Great UX
- ⚡ Infinite Message Loading for Performance
- 📤 Intuitive Drag n’ Drop Uploads
- ✨ Instant Loading States
- 🔧 Modern Data Fetching Using tRPC & Zod
- 🧠 LangChain for Infinite AI Memory
- 🌲 Pinecone as our Vector Storage
- 📊 Prisma as our ORM

---

### Prerequisites

##### Node version 18.x.x

### Cloning the repository

```
git clone https://github.com/AmrHedeiwy/emna-ai
```

### Install packages

```
npm i
```

### Setup .env file

```
NEXT_PUBLIC_SERVER_URL

DATABASE_URL

GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

NEXTAUTH_URL
NEXTAUTH_SECRET

SENDGRID_API_KEY

UPLOADTHING_SECRET
UPLOADTHING_APP_ID

PINECONE_API_KEY

OPENAI_API_KEY

STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

### Start the app

```
npm run dev
```

### Available commands

Running commands with npm `npm run [command]`

| command     | description                              |
| :---------- | :--------------------------------------- |
| dev         | Starts a development instance of the app |
| postinstall | Generates prisma-types for Typescript    |
