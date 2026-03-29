import { useState } from 'react'
import Sidebar from '../components/Sidebar'

const friends = [
  { id: 1, initials: 'NH', name: 'Nolan H.', email: 'nolan@example.com', online: true, status: 'Submitted A4 in CP264', classes: ['CP264', 'MA122'], color: 'violet' },
  { id: 2, initials: 'NF', name: 'Neil F.', email: 'neil@example.com', online: true, status: 'Earned 280 XP in MA122', classes: ['MA122', 'EC120'], color: 'teal' },
  { id: 3, initials: 'BJ', name: 'Ben J.', email: 'ben@example.com', online: false, status: 'Offline', classes: ['CP264'], color: 'amber' },
  { id: 4, initials: 'SE', name: 'Sarv E.', email: 'sarv@example.com', online: true, status: 'Completed Midterm Essay', classes: ['EC120', 'CP264'], color: 'red' },
  { id: 5, initials: 'VH', name: 'Victoria H.', email: 'victoria@example.com', online: false, status: 'Offline', classes: ['MA122'], color: 'violet' },
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
            <h1 className="text-white text-2xl font-bold tracking-tight">Friends</h1>
            <p className="text-gray-400 text-sm mt-1">See what your friends are up to</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors font-semibold shadow-lg shadow-violet-900/30"
          >
            + Add friend
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search friends..."
            className="w-full bg-gray-900 border border-gray-800/80 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all"
          />
        </div>

        {/* Online now */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Online now</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {filtered.filter(f => f.online).map(f => (
              <FriendCard key={f.id} friend={f} />
            ))}
          </div>
        </div>

        {/* Offline */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Offline</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {filtered.filter(f => !f.online).map(f => (
              <FriendCard key={f.id} friend={f} />
            ))}
          </div>
        </div>

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-bold text-lg">Add a friend</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition-colors">✕</button>
            </div>
            <p className="text-gray-400 text-sm mb-5">Enter your friend's email address to send them a friend request</p>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Email address</label>
            <input
              value={friendEmail}
              onChange={e => setFriendEmail(e.target.value)}
              placeholder="friend@example.com"
              className="w-full bg-gray-800/80 border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 mb-4 transition-all"
            />
            <button
              onClick={() => { setShowModal(false); setFriendEmail('') }}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-violet-900/30"
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
    <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-5 flex items-center gap-4 hover:border-violet-600/40 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
      <div className="relative shrink-0">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${avatarColors[f.color]}`}>
          {f.initials}
        </div>
        <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-gray-900 ${f.online ? 'bg-emerald-400' : 'bg-gray-600'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-sm">{f.name}</p>
        <p className="text-gray-500 text-xs mt-0.5 truncate">{f.status}</p>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {f.classes.map(cls => (
            <span key={cls} className="text-xs bg-gray-800 border border-gray-700/60 text-gray-400 px-2 py-0.5 rounded-md font-medium">
              {cls}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Friends