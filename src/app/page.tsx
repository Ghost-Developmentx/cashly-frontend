import Link from 'next/link';

export default function HomePage() {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Cashly
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your AI-powered financial advisor for small businesses
          </p>

          <div className="space-x-4">
            <Link
                href="/sign-in"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Sign In
            </Link>
            <Link
                href="/sign-up"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
  );
}