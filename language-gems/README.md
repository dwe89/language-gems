# Language Gems

Language Gems is an interactive language learning platform designed for schools and educational institutions, offering a comprehensive solution for language teachers to manage their classes, track student progress, and create engaging learning experiences.

## 🌟 Features

### For Teachers
- **Dashboard:** Central hub for teachers to manage all aspects of their language classes
- **Class Management:** Create and manage class lists, generate login credentials for students
- **Student Management:** View and manage student profiles, track individual progress
- **Custom Content Creation:** Upload custom vocabulary lists to generate games and exercises
- **Progress Tracking:** Monitor student performance with detailed analytics and insights
- **Leaderboards:** Foster healthy competition with class and individual achievement tracking
- **Assignments:** Create and assign tasks to students with deadlines and requirements

### For Students
- **Interactive Learning:** Engaging games and exercises to practice vocabulary and grammar
- **Progress Tracking:** Visualize learning progress and identify areas for improvement
- **Achievements:** Earn badges and rewards for consistent practice and skill mastery
- **Personalized Learning:** Adaptive content that adjusts to individual learning pace and needs

## 🚀 Development Status

### Completed Pages
- ✅ Dashboard Home
- ✅ Classes Management
- ✅ Student Management
- ✅ Custom Content Creation
- ✅ Vocabulary Management
- ✅ Settings
- ✅ Progress Tracking
- ✅ Leaderboards

### In Progress
- 🔄 Assignments
- 🔄 Resource Library
- 🔄 Professional Development
- 🔄 Collaboration Hub
- 🔄 Analytics & Insights
- 🔄 Cultural Hub
- 🔄 Feedback & Support

## 🛠️ Technology Stack

- **Frontend:** Next.js, React, TailwindCSS
- **Backend:** Supabase (PostgreSQL, Authentication, Storage)
- **Deployment:** Vercel

## 📋 Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/language-gems.git
cd language-gems
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` with your Supabase credentials

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Project Structure

```
language-gems/
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js app router
│   │   ├── dashboard/    # Teacher dashboard pages
│   │   ├── auth/         # Authentication pages
│   │   └── ...           # Other app routes
│   ├── components/       # Reusable React components
│   ├── lib/              # Utility functions and types
│   ├── middleware.ts     # Route protection middleware
│   └── ...               # Other source files
├── styles/               # Global styles
└── ...                   # Configuration files
```

## 🔒 Authentication

The app uses Supabase for authentication and implements role-based access control:
- **Public routes:** Landing pages, marketing content
- **Protected routes:** Require authentication
- **Teacher-only routes:** Accessible only to users with teacher role
- **Student routes:** Default authenticated routes for student users

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

© 2023-2025 Language Gems. All rights reserved.
