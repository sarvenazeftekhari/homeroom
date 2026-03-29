import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function Profile() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
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
          <h1 className="text-white text-2xl font-semibold">Your Profile</h1>
          <p className="text-gray-400 text-sm mt-1">This is how you appear across HomeRoom</p>
        </div>

        {/* Avatar preview */}
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-violet-800 rounded-full flex items-center justify-center text-violet-200 text-2xl font-semibold">
            {initials}
          </div>
          <div>
            <p className="text-white font-semibold text-lg">
              {firstName || 'First'} {lastName || 'Last'}
            </p>
            <p className="text-gray-500 text-sm">HomeRoom Student</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-white font-medium">Personal info</h2>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">First name</label>
            <input
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="e.g. Sarvenaz"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Last name</label>
            <input
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="e.g. Eftekhari"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-colors mt-2"
          >
            {saved ? '✓ Saved!' : 'Save changes'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default Profile