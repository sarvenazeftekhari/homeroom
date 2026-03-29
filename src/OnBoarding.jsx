import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase'
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'

function Onboarding() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([{ name: '', code: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleClassChange(index, field, value) {
    setClasses(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c))
  }

  function addClassRow() {
    setClasses(prev => [...prev, { name: '', code: '' }])
  }

  function removeClassRow(index) {
    setClasses(prev => prev.filter((_, i) => i !== index))
  }

  async function handleFinish() {
    const uid = auth.currentUser?.uid
    if (!uid) return

    const validClasses = classes.filter(c => c.code.trim())
    if (validClasses.length === 0) {
      setError('Add at least one class to continue.')
      return
    }

    setLoading(true)
    try {
      // Write each class as a doc in users/{uid}/classes
      const classesRef = collection(db, 'users', uid, 'classes')
      for (const c of validClasses) {
        await addDoc(classesRef, {
          name: c.name.trim(),
          code: c.code.trim(),
          createdAt: serverTimestamp(),
        })
      }

      // Mark onboarding complete on the user profile
      await updateDoc(doc(db, 'users', uid), { onboardingComplete: true })

      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 w-full max-w-lg">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
            HR
          </div>
          <span className="text-white text-2xl font-semibold">HomeRoom</span>
        </div>

        <h1 className="text-white text-2xl font-semibold mb-1">What classes are you in?</h1>
        <p className="text-gray-400 text-sm mb-8">Add your courses to get started. You can always add more later.</p>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 mb-4">
          {classes.map((c, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input
                value={c.code}
                onChange={e => handleClassChange(i, 'code', e.target.value)}
                placeholder="Code — e.g. CS 246"
                className="w-36 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
              />
              <input
                value={c.name}
                onChange={e => handleClassChange(i, 'name', e.target.value)}
                placeholder="Name — e.g. Object Oriented Programming"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
              />
              {classes.length > 1 && (
                <button
                  onClick={() => removeClassRow(i)}
                  className="text-gray-500 hover:text-red-400 text-lg px-1"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addClassRow}
          className="text-violet-400 hover:text-violet-300 text-sm mb-8"
        >
          + Add another class
        </button>

        <button
          onClick={handleFinish}
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? 'Saving...' : 'Finish setup →'}
        </button>
      </div>
    </div>
  )
}

export default Onboarding