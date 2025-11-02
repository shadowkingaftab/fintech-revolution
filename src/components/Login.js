import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';

function Login() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-pink-900">
      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">FinTech Revolution</h1>
        <p className="text-gray-600 mb-8">Track your empire</p>
        <button
          onClick={signInWithGoogle}
          className="flex items-center gap-3 mx-auto px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <FcGoogle size={24} />
          <span className="font-medium">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}

export default Login;