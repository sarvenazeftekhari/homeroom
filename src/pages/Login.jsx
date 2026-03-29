import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

function Login() {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')

    if (isSignUp) {
      if (!name.trim()) {
        setError('Please enter your name.')
        return
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    setLoading(true)

    try {
      if (isSignUp) {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)

        await setDoc(doc(db, 'users', user.uid), {
          name: name.trim(),
          email: user.email,
          program: '',
          yearOfStudy: '',
          onboardingComplete: false,
          createdAt: serverTimestamp(),
        })

        navigate('/onboarding')
      } else {
        const { user } = await signInWithEmailAndPassword(auth, email, password)

        const profileRef = doc(db, 'users', user.uid)
        const profileSnap = await getDoc(profileRef)
        const data = profileSnap.data()

        if (!data?.onboardingComplete) {
          navigate('/onboarding')
        } else {
          navigate('/dashboard')
        }
      }
    } catch (err) {
      if (err.code === 'auth/invalid-email') setError('Invalid email address.')
      else if (err.code === 'auth/invalid-credential') setError('Invalid email or password.')
      else if (err.code === 'auth/wrong-password') setError('Wrong password.')
      else if (err.code === 'auth/user-not-found') setError('No account found with that email.')
      else if (err.code === 'auth/email-already-in-use') setError('An account with that email already exists.')
      else if (err.code === 'auth/weak-password') setError('Password must be at least 6 characters.')
      else setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
            HR
          </div>
          <span className="text-white text-2xl font-semibold">HomeRoom</span>
        </div>

        <h1 className="text-white text-2xl font-semibold mb-1">
          {isSignUp ? 'Create an account' : 'Welcome back'}
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          {isSignUp ? 'Sign up to start earning XP' : 'Sign in to your account to continue'}
        </p>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {isSignUp && (
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          )}

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          {isSignUp && (
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Enter password again"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl mt-2 transition-colors"
          >
            {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
          </button>
        </div>

        <p className="text-gray-500 text-sm text-center mt-6">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
              setName('')
              setEmail('')
              setPassword('')
              setConfirmPassword('')
            }}
            className="text-violet-400 cursor-pointer hover:text-violet-300"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login