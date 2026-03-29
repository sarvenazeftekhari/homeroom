import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

function Onboarding() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [program, setProgram] = useState('')
  const [yearOfStudy, setYearOfStudy] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      if (!auth.currentUser) return

      try {
        const snap = await getDoc(doc(db, 'users', auth.currentUser.uid))
        const data = snap.data()

        if (data) {
          setName(data.name || '')
          setProgram(data.program || '')
          setYearOfStudy(data.yearOfStudy || '')
        }
      } catch (err) {
        console.error(err)
      }
    }

    loadProfile()
  }, [])

  async function handleFinish() {
    setError('')

    if (!auth.currentUser) {
      setError('You must be signed in.')
      return
    }

    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }

    if (!program.trim()) {
      setError('Please enter your program.')
      return
    }

    if (!yearOfStudy) {
      setError('Please select your year of study.')
      return
    }

    if (!password) {
      setError('Please confirm your password.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        name: name.trim(),
        program: program.trim(),
        yearOfStudy: yearOfStudy.trim(),
        onboardingComplete: true,
      })

      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
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

        <h1 className="text-white text-2xl font-semibold mb-1">Complete onboarding</h1>
        <p className="text-gray-400 text-sm mb-8">Tell us a bit about yourself</p>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
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

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Program</label>
            <input
              type="text"
              value={program}
              onChange={e => setProgram(e.target.value)}
              placeholder="e.g. Computer Science"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Year of study</label>
            <select
              value={yearOfStudy}
              onChange={e => setYearOfStudy(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500"
            >
              <option value="">Select year</option>
              <option value="1">1st year</option>
              <option value="2">2nd year</option>
              <option value="3">3rd year</option>
              <option value="4">4th year</option>
              <option value="5+">5th year+</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Password confirmation</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Enter your password again"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <button
            onClick={handleFinish}
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl mt-2 transition-colors"
          >
            {loading ? 'Saving...' : 'Finish onboarding'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Onboarding