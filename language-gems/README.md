# LanguageGems 💎

A multi-language learning platform for schools and individual learners. LanguageGems makes language acquisition fun through gamification with a gems and treasure theme.

## Features

- **Multi-Language Support**: Learn multiple languages with pre-built vocabulary lists
- **Gamified Learning**: Earn gems and unlock achievements as you progress
- **Interactive Exercises**: Quizzes, matching games, and pronunciation challenges
- **For Schools**: Special features for teachers to track progress and assign homework
- **Customizable Vocabulary**: Teachers can create and assign custom vocabulary lists
- **Progress Tracking**: Monitor your learning journey with detailed analytics

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Supabase (Authentication, Database)
- **Payments**: Stripe for subscription management
- **Hosting**: Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account (for payments)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/language-gems.git
cd language-gems
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file with your credentials
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
language-gems/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # Reusable React components
│   ├── lib/              # Utility functions and services
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
├── .env.local            # Environment variables (not in version control)
└── ...                   # Configuration files
```

## Deployment

This application is designed to be deployed on Cloudflare Pages. Follow their documentation for deploying a Next.js application.

## License

[MIT](LICENSE)

## Acknowledgements

- Illustrations and design inspiration from various sources
- Next.js team for the incredible framework
- Supabase for the backend services
