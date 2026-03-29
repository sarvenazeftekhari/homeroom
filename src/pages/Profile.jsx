import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function Profile() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState(localStorage.getItem('hr_first_name') || '')
  const [lastName, setLastName] = useState(localStorage.getItem('hr_last_name') || '')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    if (!firstName.trim()) return
    localStorage.setItem('hr_first_name', firstName.trim())
    localStorage.setItem('hr_last_name', lastName.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'ME'

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar active="Profile" />

      <div className="ml-56 flex-1 p-8 flex flex-col gap-6 max-w-2xl">

        <div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-gray-400 text-sm mt-1">This is how you appear across HomeRoom</p>
        </div>

        {/* Avatar preview */}
        <div className="flex items-center gap-5 bg-gray-900 border border-gray-800/80 rounded-2xl p-6">
          <div className="w-20 h-20 bg-violet-700 rounded-full flex items-center justify-center text-violet-100 text-2xl font-bold ring-4 ring-violet-500/20 shadow-lg shadow-violet-900/30">
            {initials}
          </div>
          <div>
            <p className="text-white font-bold text-xl">
              {firstName || 'First'} {lastName || 'Last'}
            </p>
            <p className="text-gray-500 text-sm mt-0.5">HomeRoom Student</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-6 flex flex-col gap-5">
          <h2 className="text-white font-bold text-base">Personal info</h2>

          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">First name</label>
            <input
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="e.g. Sarvenaz"
              className="w-full bg-gray-800/80 border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Last name</label>
            <input
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="e.g. Eftekhari"
              className="w-full bg-gray-800/80 border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all"
            />
          </div>

          <button
            onClick={handleSave}
            className={`w-full font-semibold py-3 rounded-xl transition-all shadow-lg mt-1 ${
              saved
                ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-900/30'
            }`}
          >
            {saved ? '✓ Saved!' : 'Save changes'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default Profile