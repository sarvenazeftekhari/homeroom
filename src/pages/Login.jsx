import { useNavigate } from 'react-router-dom'

function Login() {

    const navigate = useNavigate()    

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
            HR
          </div>
          <span className="text-white text-2xl font-semibold">HomeRoom</span>
        </div>

        {/* Title */}
        <h1 className="text-white text-2xl font-semibold mb-1">Welcome back</h1>
        <p className="text-gray-400 text-sm mb-8">Sign in to your account to continue</p>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl mt-2 transition-colors"
          >
            Sign in
          </button>
        </div>

        {/* Switch to sign up */}
        <p className="text-gray-500 text-sm text-center mt-6">
          Don't have an account?{' '}
          <span className="text-violet-400 cursor-pointer hover:text-violet-300">
            Sign up
          </span>
        </p>

      </div>
    </div>
  )
}

export default Login