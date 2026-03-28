import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function Classes() {
  const navigate = useNavigate()
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [newClassName, setNewClassName] = useState('')
  const [newClassCode, setNewClassCode] = useState('')

  const classes = [
    { id: 1, name: 'CS 246 — OOP', instructor: 'Prof. Smith', students: 34, rank: 2, xp: 980, pending: 2, color: 'violet' },
    { id: 2, name: 'MATH 235 — Linear Algebra', instructor: 'Prof. Jones', students: 28, rank: 1, xp: 740, pending: 0, color: 'teal' },
    { id: 3, name: 'ECON 101 — Micro', instructor: 'Prof. Lee', students: 120, rank: 14, xp: 420, pending: 1, color: 'amber' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar active="My Classes" />

      <div className="ml-56 flex-1 p-8 flex flex-col gap-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-semibold">My Classes</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your classes and track your progress</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              Join a class
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors"
            >
              + Create class
            </button>
          </div>
        </div>

        {/* Class cards */}
        <div className="grid grid-cols-1 gap-4">
          {classes.map(cls => (
            <ClassCard key={cls.id} cls={cls} onClick={() => navigate(`/classes/${cls.id}`)} />
          ))}
        </div>

      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <Modal title="Join a class" onClose={() => setShowJoinModal(false)}>
          <p className="text-gray-400 text-sm mb-4">Ask your instructor or classmate for the class code</p>
          <label className="text-gray-400 text-sm mb-1 block">Class code</label>
          <input
            value={joinCode}
            onChange={e => setJoinCode(e.target.value)}
            placeholder="e.g. CS246-XK9"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 mb-4"
          />
          <button className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-colors">
            Join class
          </button>
        </Modal>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <Modal title="Create a class" onClose={() => setShowCreateModal(false)}>
          <label className="text-gray-400 text-sm mb-1 block">Class name</label>
          <input
            value={newClassName}
            onChange={e => setNewClassName(e.target.value)}
            placeholder="e.g. CS 246 — OOP"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 mb-4"
          />
          <label className="text-gray-400 text-sm mb-1 block">Class code</label>
          <input
            value={newClassCode}
            onChange={e => setNewClassCode(e.target.value)}
            placeholder="e.g. CS246-XK9"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 mb-4"
          />
          <button className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-colors">
            Create class
          </button>
        </Modal>
      )}

    </div>
  )
}

function ClassCard({ cls, onClick }) {
  const colors = {
    violet: 'bg-violet-600',
    teal: 'bg-teal-600',
    amber: 'bg-amber-600',
  }
  return (
    <div
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center gap-6 cursor-pointer hover:border-violet-700 transition-colors"
    >
      <div className={`w-12 h-12 ${colors[cls.color]} rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0`}>
        {cls.name.charAt(0)}
      </div>
      <div className="flex-1">
        <h3 className="text-white font-semibold text-base">{cls.name}</h3>
        <p className="text-gray-400 text-sm mt-0.5">{cls.instructor} · {cls.students} students</p>
      </div>
      <div className="flex gap-8 text-center">
        <div>
          <p className="text-white font-semibold">{cls.xp} XP</p>
          <p className="text-gray-500 text-xs mt-0.5">earned</p>
        </div>
        <div>
          <p className="text-white font-semibold">#{cls.rank}</p>
          <p className="text-gray-500 text-xs mt-0.5">rank</p>
        </div>
        <div>
          <p className={`font-semibold ${cls.pending > 0 ? 'text-amber-400' : 'text-green-400'}`}>{cls.pending}</p>
          <p className="text-gray-500 text-xs mt-0.5">pending</p>
        </div>
      </div>
      <span className="text-gray-600 text-lg">›</span>
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-semibold text-lg">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Classes