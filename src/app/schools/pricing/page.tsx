import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'School & Institution Pricing | Language Gems',
  description: 'Affordable language learning solutions for schools, universities, and educational institutions.',
};

const pricingPlans = [
  {
    name: 'Classroom',
    price: '$99',
    period: 'per month',
    description: 'Perfect for individual classrooms or small language departments',
    features: [
      'Up to 30 student accounts',
      '1 teacher admin account',
      'Access to all languages',
      'Basic progress tracking',
      'Classroom leaderboards',
      'Email support',
    ],
    buttonText: 'Get Started',
    buttonLink: '/schools/contact?plan=classroom',
    highlighted: false,
    color: 'bg-gray-50 border-gray-300',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    name: 'School',
    price: '$299',
    period: 'per month',
    description: 'Designed for entire schools or larger language departments',
    features: [
      'Up to 150 student accounts',
      '5 teacher admin accounts',
      'Access to all languages',
      'Advanced progress tracking',
      'Classroom leaderboards',
      'Custom lesson creation',
      'Priority email support',
      'Virtual classroom features',
    ],
    buttonText: 'Request a Demo',
    buttonLink: '/schools/demo?plan=school',
    highlighted: true,
    color: 'bg-blue-50 border-blue-500',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    name: 'District',
    price: 'Custom',
    period: 'pricing',
    description: 'Enterprise solution for school districts and large institutions',
    features: [
      'Unlimited student accounts',
      'Unlimited teacher accounts',
      'Access to all languages',
      'Advanced analytics dashboard',
      'Custom curriculum integration',
      'API access',
      'Dedicated account manager',
      '24/7 premium support',
      'On-site training available',
    ],
    buttonText: 'Contact Sales',
    buttonLink: '/schools/contact?plan=district',
    highlighted: false,
    color: 'bg-purple-50 border-purple-300',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
  },
];

const testimonials = [
  {
    quote: "Language Gems has transformed our Spanish curriculum. Students are more engaged than ever, and our proficiency rates have increased significantly.",
    author: "Maria Rodriguez",
    title: "Language Department Chair",
    school: "Lincoln High School",
    avatar: "👩‍🏫",
  },
  {
    quote: "The administrative tools and analytics have made tracking student progress so much easier. We can quickly identify areas where students need additional support.",
    author: "James Wilson",
    title: "District Technology Coordinator",
    school: "Westside School District",
    avatar: "👨‍💼",
  },
  {
    quote: "Our university has implemented Language Gems across all our language programs. The flexibility and comprehensive content have made it an indispensable resource.",
    author: "Dr. Sarah Chen",
    title: "Dean of Languages",
    school: "Riverside University",
    avatar: "👩‍🎓",
  },
];

const faqs = [
  {
    question: "How does billing work for school accounts?",
    answer: "School accounts are billed monthly or annually, with discounts available for annual commitments. You'll only be charged for active student accounts, and we offer flexible options to add or remove accounts as needed.",
  },
  {
    question: "Can we integrate Language Gems with our existing LMS?",
    answer: "Yes! Language Gems offers integrations with popular Learning Management Systems including Canvas, Blackboard, Moodle, and Google Classroom. Our API also allows for custom integrations with other systems.",
  },
  {
    question: "Do you offer training for teachers?",
    answer: "Absolutely. All school plans include initial training sessions for teachers. We also provide comprehensive documentation, tutorial videos, and regular webinars to help teachers make the most of our platform.",
  },
  {
    question: "Can we customize the curriculum to match our existing syllabus?",
    answer: "Yes, School and District plans include custom curriculum options. Your teachers can create custom lessons, modify existing content, and align the platform with your specific educational goals and standards.",
  },
  {
    question: "Is there a minimum contract length?",
    answer: "Our Classroom plan has no minimum term. School plans require a 6-month minimum commitment, and District plans are typically annual. We can customize contract terms based on your specific needs.",
  },
];

export default function SchoolsPricingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">School & Institution Pricing</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Affordable, flexible language learning solutions designed specifically for educational institutions of all sizes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {pricingPlans.map((plan, index) => (
          <div 
            key={index} 
            className={`rounded-xl overflow-hidden shadow-lg border-2 ${plan.highlighted ? 'transform md:-translate-y-4' : ''} transition-all duration-300 ${plan.color}`}
          >
            {plan.highlighted && (
              <div className="bg-blue-600 text-white text-center py-2 font-bold">
                Most Popular
              </div>
            )}
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <div className="flex items-end mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-600 ml-1">{plan.period}</span>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href={plan.buttonLink} 
                className={`block text-center py-3 px-6 rounded-full font-bold text-white ${plan.buttonColor} transition-colors w-full`}
              >
                {plan.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Language Gems for Education?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Curriculum Alignment</h3>
            <p className="text-gray-600">Our content aligns with ACTFL, CEFR, and other educational standards to seamlessly integrate with your existing curriculum.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Comprehensive Analytics</h3>
            <p className="text-gray-600">Detailed insights into student performance help teachers identify strengths and areas for improvement.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-2">Dedicated Support</h3>
            <p className="text-gray-600">Our education specialists provide ongoing support, training, and resources for your teaching staff.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-2">Multi-platform Access</h3>
            <p className="text-gray-600">Students can learn on any device, making it perfect for both classroom and remote learning environments.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold mb-2">Gamified Learning</h3>
            <p className="text-gray-600">Engaging games and activities make language learning fun while reinforcing important concepts.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-xl font-bold mb-2">Multiple Languages</h3>
            <p className="text-gray-600">Support for over 20 languages with consistent methodology across all of them.</p>
          </div>
        </div>
      </section>
      
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">What Educators Are Saying</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
              <div className="text-5xl mb-4 text-center">{testimonial.avatar}</div>
              <p className="italic text-gray-700 mb-6">"{testimonial.quote}"</p>
              <div className="text-center">
                <p className="font-bold">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.title}</p>
                <p className="text-sm text-gray-600">{testimonial.school}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
      
      <section className="bg-blue-600 text-white rounded-2xl p-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to transform language education at your institution?</h2>
        <p className="text-xl mb-8">Contact our education team today to discuss your specific needs and get a customized quote.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/schools/demo" 
            className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-colors"
          >
            Request a Demo
          </Link>
          <Link 
            href="/schools/contact" 
            className="bg-transparent hover:bg-blue-700 border-2 border-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            Contact Sales
          </Link>
        </div>
      </section>
    </div>
  );
} 