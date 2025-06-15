export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Test Page</h1>
        <p className="text-slate-600">This is a test page to verify the app is working.</p>
        <div className="mt-8">
          <a href="/blog" className="text-indigo-600 hover:text-indigo-700 mr-4">Go to Blog</a>
          <a href="/shop" className="text-indigo-600 hover:text-indigo-700">Go to Shop</a>
        </div>
      </div>
    </div>
  );
} 