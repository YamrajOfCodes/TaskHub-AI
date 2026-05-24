# TaskHub AI

TaskHub AI is a full-stack AI-powered task management platform built with Next.js, Flask, Supabase, and AI image generation APIs.

Admins can create and assign product-based creative tasks, while users can generate AI images, submit work, and receive feedback through a modern dashboard.

---

# Features

## Admin Features

- Create tasks
- Upload product images
- Assign tasks to users
- Review submissions
- Accept or request revisions
- Add feedback

## User Features

- Login with Email/Password
- Login with Google OAuth
- View assigned tasks
- Generate AI product images
- Submit generated work
- View admin feedback

## AI Features

- AI image generation
- Creative prompt presets
- Product photography themes
- Instant image preview

---

# Tech Stack

## Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS

## Backend

- Flask
- Python
- REST API

## Database & Auth

- Supabase
- Google OAuth

## AI

- Pollinations AI

---

# Project Architecture

```txt
taskhub-ai/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── utils/
│   └── lib/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── database/
│   ├── utils/
│   └── app.py
│
└── README.md
```

---

# Authentication Flow

## Normal Login

Frontend → Flask API → JWT Token → LocalStorage

## Google Login

Frontend → Supabase OAuth → Supabase Session → LocalStorage

---

# Database Schema

## Users

- id
- email
- name
- role
- avatar_url
- password

## Tasks

- id
- title
- description
- status
- assigned_to
- product_image_url
- feedback

## Submissions

- id
- task_id
- user_id
- image_url
- feedback
- status

---

# Admin Credentials

```txt
Email: admin@gmail.com
Password: admin123
```

---

# Installation

## Frontend

```bash
cd frontend

npm install

npm run dev
```

## Backend

```bash
cd backend

pip install -r requirements.txt

python app.py
```

---

# Environment Variables

## Frontend (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## Backend (.env)

```env
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
JWT_SECRET=your_secret
```

---

# API Routes

## Auth

- POST `/login`

## Tasks

- GET `/tasks`
- POST `/tasks`
- PUT `/assign-task/<id>`

## Submissions

- POST `/submit-task`
- GET `/submissions`
- PUT `/accept-task/<id>`
- PUT `/revision-task/<id>`

## AI

- POST `/generate-image`

---

# Future Improvements

- Real-time notifications
- Team collaboration
- AI prompt customization
- Image history
- Role permissions
- Analytics dashboard

---

# Author

Built as a learning-focused full-stack AI project using modern web technologies.
