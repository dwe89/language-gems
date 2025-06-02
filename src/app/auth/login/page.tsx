import AuthForm from '../../../components/auth/AuthForm';
import Footer from 'gems/components/layout/Footer';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-900 to-blue-900">
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <AuthForm mode="login" />
      </main>
      
      <Footer />
    </div>
  );
} 