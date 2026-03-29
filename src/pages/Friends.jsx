import { useState } from 'react'
import Sidebar from '../components/Sidebar'

const friends = [
  { id: 1, initials: 'AK', name: 'Aarav K.', email: 'aarav@example.com', online: true, status: 'Submitted A4 in CS 246', classes: ['CS 246', 'MATH 235'], color: 'violet' },
  { id: 2, initials: 'SL', name: 'Sara L.', email: 'sara@example.com', online: true, status: 'Earned 280 XP in MATH 235', classes: ['MATH 235', 'ECON 101'], color: 'teal' },
  { id: 3, initials: 'MR', name: 'Mike R.', email: 'mike@example.com', online: false, status: 'Offline', classes: ['CS 246'], color: 'amber' },
  { id: 4, initials: 'JT', name: 'Jake T.', email: 'jake@example.com', online: true, status: 'Completed Midterm Essay', classes: ['ECON 101', 'CS 246'], color: 'red' },
  { id: 5, initials: 'PM', name: 'Priya M.', email: 'priya@example.com', online: false, status: 'Offline', classes: ['MATH 235'], color: 'violet' },
]

const avatarColors = {
  violet: 'bg-violet-800 text-violet-200',
  teal: 'bg-teal-800 text-teal-200',
  amber: 'bg-amber-800 text-amber-200',
  red: 'bg-red-900 text-red-200',
}

function Friends() {
  const [showModal, setShowModal] = useState(false)
  const [friendEmail, setFriendEmail] = useState('')
  const [search, setSearch] = useState('')

  const filtered = friends.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar active="Friends" />

      <div className="ml-56 flex-1 p-8 flex flex-col gap-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-semibold">Friends</h1>
            <p className="text-gray-400 text-sm mt-1">See what your friends are up to</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors"
          >
            + Add friend
          </button>
        </div>

        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search friends..."
          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
        />

        {/* Online now */}
        <div>
          <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-3">Online now</h2>
          <div className="grid grid-cols-1 gap-3">
            {filtered.filter(f => f.online).map(f => (
              <FriendCard key={f.id} friend={f} />
            ))}
          </div>
        </div>

        {/* Offline */}
        <div>
          <h2 className="text-gray-400 text-xs uppercase tracking-widest mb-3">Offline</h2>
          <div className="grid grid-cols-1 gap-3">
            {filtered.filter(f => !f.online).map(f => (
              <FriendCard key={f.id} friend={f} />
            ))}
          </div>
        </div>

      </div>

      {/* Add Friend Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-semibold text-lg">Add a friend</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white text-xl">✕</button>
            </div>
            <p className="text-gray-400 text-sm mb-4">Enter your friend's email address to send them a friend request</p>
            <label className="text-gray-400 text-sm mb-1 block">Email address</label>
            <input
              value={friendEmail}
              onChange={e => setFriendEmail(e.target.value)}
              placeholder="friend@example.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 mb-4"
            />
            <button
              onClick={() => { setShowModal(false); setFriendEmail('') }}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Send friend request
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function FriendCard({ friend: f }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4 hover:border-violet-700 transition-colors">
      <div className="relative">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold ${avatarColors[f.color]}`}>
          {f.initials}
        </div>
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${f.online ? 'bg-green-400' : 'bg-gray-600'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold">{f.name}</p>
        <p className="text-gray-500 text-sm mt-0.5 truncate">{f.status}</p>
        <div className="flex gap-2 mt-2 flex-wrap">
          {f.classes.map(cls => (
            <span key={cls} className="text-xs bg-gray-800 border border-gray-700 text-gray-400 px-2 py-0.5 rounded-full">
              {cls}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Friends