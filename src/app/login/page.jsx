'use client';

  import { useContext, useState } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import Link from 'next/link';

const Page = () => {
  const { signIn, signInWithGoogle } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
     } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (result?.user) {
        const userInfo = {
          email: result.user.email || '',
          name: result.user.displayName || '',
        };
        await axiosPublic.post('/users', userInfo);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError(`Google sign-in failed: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDemoLogin = (type) => {
    if (type === 'user') {
      setEmail('user@gmail.com');
      setPassword('user123456');
    } else {
      setEmail('admin@gmail.com');
      setPassword('admin123456');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row justify-center items-center gap-8 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#25527E]">Login</h2>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleDemoLogin('user')}
            className="w-1/2 bg-blue-100 text-blue-700 font-medium py-2 rounded-md hover:bg-blue-200 transition"
          >
            Demo User
          </button>
          <button
            onClick={() => handleDemoLogin('admin')}
            className="w-1/2 bg-purple-100 text-purple-700 font-medium py-2 rounded-md hover:bg-purple-200 transition"
          >
            Demo Admin
          </button>
        </div>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Your Email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Your Password"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 font-semibold text-white rounded-md ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#22C55E] hover:bg-[#25a755] duration-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* Google Login Button */}
        <div>
          <button
            onClick={handleGoogleLogin}
            className="max-w-[320px] flex items-center justify-center mx-auto mt-4 py-2 px-5 text-sm font-bold text-center uppercase rounded-md border border-[rgba(50,50,80,0.25)] gap-3 text-white bg-[rgb(50,50,80)] cursor-pointer transition-all duration-600 ease-in-out hover:scale-[1.02] hover:bg-[rgb(90,90,120)] focus:outline-none"
          >
            <svg
              viewBox="0 0 256 262"
              preserveAspectRatio="xMidYMid"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 fill-white mr-2"
            >
              <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023c24.659-22.774 38.875-56.282 38.875-96.027"/>
              <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-40.298 31.187C35.393 231.798 79.49 261.1 130.55 261.1"/>
              <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-41.647-33.418C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"/>
              <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="mt-5 text-center text-gray-600">
          Do not have an account?{' '}
          <Link href="/Signup" className="text-[#f0652b] hover:underline">
            Sign up
          </Link>
        </p>
      </div>

 
    </div>
  );
};

export default Page;
