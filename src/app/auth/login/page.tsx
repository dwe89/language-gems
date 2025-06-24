import { Suspense } from 'react';
import AuthForm from '../../../components/auth/AuthForm';
import Footer from 'gems/components/layout/Footer';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-900 to-blue-900">
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <Suspense fallback={<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>}>
          <AuthForm mode="login" />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
} 