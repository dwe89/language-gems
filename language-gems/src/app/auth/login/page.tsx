import AuthForm from 'gems/components/auth/AuthForm';
import Navigation from 'gems/components/layout/Navigation';
import Footer from 'gems/components/layout/Footer';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <AuthForm mode="login" />
      </main>
      
      <Footer />
    </div>
  );
} 