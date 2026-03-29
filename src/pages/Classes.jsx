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
    { id: 1, name: 'CP264: Data Structures II', instructor: 'Prof. Fan', students: 34, rank: 2, xp: 980, pending: 2, color: 'violet' },
    { id: 2, name: 'MA122: Linear Algebra', instructor: 'Prof. Zhang', students: 28, rank: 1, xp: 740, pending: 0, color: 'teal' },
    { id: 3, name: 'EC120: Microeconomics', instructor: 'Prof. Schirle', students: 120, rank: 14, xp: 420, pending: 1, color: 'amber' },
  ]

  const colors = {
    violet: 'bg-violet-600 shadow-violet-900/40',
    teal: 'bg-teal-600 shadow-teal-900/40',
    amber: 'bg-amber-600 shadow-amber-900/40',
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar active="My Classes" />

      <div className="ml-56 flex-1 p-8 flex flex-col gap-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight">My Classes</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your classes and track your progress</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm border border-gray-700/80 hover:bg-gray-700 hover:text-white transition-all font-medium"
            >
              Join a class
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm hover:bg-violet-500 transition-all font-semibold shadow-lg shadow-violet-900/30"
            >
              + Create class
            </button>
          </div>
        </div>

        {/* Class cards */}
        <div className="grid grid-cols-1 gap-3">
          {classes.map(cls => (
            <div
              key={cls.id}
              onClick={() => navigate(`/classes/${cls.id}`)}
              className="bg-gray-900 border border-gray-800/80 rounded-2xl p-6 flex items-center gap-6 cursor-pointer hover:border-violet-600/40 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`w-12 h-12 ${colors[cls.color]} rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg`}>
                {cls.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-base">{cls.name}</h3>
                <p className="text-gray-400 text-sm mt-0.5">{cls.instructor} · {cls.students} students</p>
              </div>
              <div className="flex gap-8 text-center">
                <div>
                  <p className="text-white font-bold text-base">{cls.xp} XP</p>
                  <p className="text-gray-500 text-xs mt-0.5">earned</p>
                </div>
                <div>
                  <p className="text-white font-bold text-base">#{cls.rank}</p>
                  <p className="text-gray-500 text-xs mt-0.5">rank</p>
                </div>
                <div>
                  <p className={`font-bold text-base ${cls.pending > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>{cls.pending}</p>
                  <p className="text-gray-500 text-xs mt-0.5">pending</p>
                </div>
              </div>
              <span className="text-gray-600 text-xl ml-2">›</span>
            </div>
          ))}
        </div>
      </div>

      {showJoinModal && (
        <Modal title="Join a class" onClose={() => setShowJoinModal(false)}>
          <p className="text-gray-400 text-sm mb-5">Ask your instructor or classmate for the class code</p>
          <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Class code</label>
          <input
            value={joinCode}
            onChange={e => setJoinCode(e.target.value)}
            placeholder="e.g. CP264-XK9"
            className="w-full bg-gray-800/80 border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 mb-4 transition-all"
          />
          <button className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-violet-900/30">
            Join class
          </button>
        </Modal>
      )}

      {showCreateModal && (
        <Modal title="Create a class" onClose={() => setShowCreateModal(false)}>
          <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Class name</label>
          <input
            value={newClassName}
            onChange={e => setNewClassName(e.target.value)}
            placeholder="e.g. CP264: Data Structures II"
            className="w-full bg-gray-800/80 border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 mb-4 transition-all"
          />
          <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Class code</label>
          <input
            value={newClassCode}
            onChange={e => setNewClassCode(e.target.value)}
            placeholder="e.g. CP264-XK9"
            className="w-full bg-gray-800/80 border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 mb-4 transition-all"
          />
          <button className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-violet-900/30">
            Create class
          </button>
        </Modal>
      )}
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition-colors">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Classes