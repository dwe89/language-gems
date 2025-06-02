export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gradient-blue-purple">Terms of Service</h1>
        
        <div className="bg-indigo-900/20 backdrop-blur-sm rounded-lg p-6 mb-6 text-white/90">
          <p className="mb-4">Last Updated: June 1, 2023</p>
          
          <p className="mb-6">
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the 
            Language Gems website (the "Service") operated by Language Gems ("us", "we", or "our").
          </p>
          
          <p className="mb-6">
            Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. 
            These Terms apply to all visitors, users, and others who access or use the Service.
          </p>
          
          <p className="mb-6">
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with 
            any part of the terms, then you may not access the Service.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8 text-cyan-300">1. Accounts</h2>
          
          <p className="mb-4">
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
            Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>
          
          <p className="mb-4">
            You are responsible for safeguarding the password that you use to access the Service and for any activities 
            or actions under your password, whether your password is with our Service or a third-party service.
          </p>
          
          <p className="mb-6">
            You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware 
            of any breach of security or unauthorized use of your account.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8 text-cyan-300">2. Intellectual Property</h2>
          
          <p className="mb-4">
            The Service and its original content, features, and functionality are and will remain the exclusive property 
            of Language Gems and its licensors. The Service is protected by copyright, trademark, and other laws of both 
            the United States and foreign countries. Our trademarks and trade dress may not be used in connection with 
            any product or service without the prior written consent of Language Gems.
          </p>
          
          <p className="mb-6">
            User-generated content that you create, upload, or otherwise submit to the Service remains your property, 
            but you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, 
            translate, and distribute it in any media.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8 text-cyan-300">3. Educational Content</h2>
          
          <p className="mb-4">
            While we strive to provide accurate and up-to-date language learning content, we make no guarantees 
            regarding the accuracy, completeness, or reliability of any educational content provided through our Service.
          </p>
          
          <p className="mb-6">
            The educational content available through the Service is intended for informational and learning purposes 
            only and should not be considered a substitute for professional language instruction or translation services.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8 text-cyan-300">4. Free and Premium Services</h2>
          
          <p className="mb-4">
            Language Gems offers both free and premium (paid) services. By purchasing a premium subscription or any 
            paid service, you agree to pay the applicable fees as they become due.
          </p>
          
          <p className="mb-4">
            Fees for premium services are non-refundable except where required by law. We reserve the right to change 
            our fee structure at any time, with any changes to recurring subscription fees taking effect in the next 
            billing cycle.
          </p>
          
          <p className="mb-6">
            You may cancel your subscription at any time, but no refunds will be issued for the current billing period.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8 text-cyan-300">5. School Accounts</h2>
          
          <p className="mb-4">
            For educational institutions using our Schools service, additional terms may apply. School administrators are 
            responsible for obtaining proper consent from students (or their legal guardians for minors) before using the Service.
          </p>
          
          <p className="mb-6">
            School accounts must comply with all applicable educational privacy laws, including FERPA (in the United States) 
            or equivalent regulations in other jurisdictions.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8 text-cyan-300">6. Limitation of Liability</h2>
          
          <p className="mb-6">
            In no event shall Language Gems, nor its directors, employees, partners, agents, suppliers, or affiliates, 
            be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, 
            loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or 
            inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any 
            content obtained from the Service; and (iv) unauthorized access, use, or alteration of your transmissions or content, 
            whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have 
            been informed of the possibility of such damage.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8 text-cyan-300">7. Changes</h2>
          
          <p className="mb-6">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is 
            material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes 
            a material change will be determined at our sole discretion.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8 text-cyan-300">8. Contact Us</h2>
          
          <p className="mb-6">
            If you have any questions about these Terms, please contact us at support@language-gems.com.
          </p>
        </div>
        
        <div className="text-center">
          <a href="/privacy" className="text-cyan-300 hover:underline mr-6">Privacy Policy</a>
          <a href="/cookies" className="text-cyan-300 hover:underline">Cookie Policy</a>
        </div>
      </div>
    </div>
  );
} 