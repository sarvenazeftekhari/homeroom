import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const classData = {
  1: {
    name: 'CS 246 — OOP',
    instructor: 'Prof. Smith',
    students: 34,
    color: 'violet',
    userXP: 980,
    userRank: 2,
    userLevel: 7,
    nextLevelXP: 1200,
    avgGrade: 87,
    leaderboard: [
      { rank: 1, initials: 'AK', name: 'Aarav K.', xp: 1240, avg: 94, color: 'violet' },
      { rank: 2, initials: 'SE', name: 'You (Sarvenaz)', xp: 980, avg: 87, color: 'violet', isYou: true },
      { rank: 3, initials: 'SL', name: 'Sara L.', xp: 870, avg: 91, color: 'teal' },
      { rank: 4, initials: 'MR', name: 'Mike R.', xp: 760, avg: 83, color: 'amber' },
      { rank: 5, initials: 'JT', name: 'Jake T.', xp: 650, avg: 79, color: 'red' },
    ],
    assignments: [
      { id: 1, name: 'A1 — Linked List', difficulty: 'Easy', deadline: '2025-01-20', status: 'done', grade: 96, xp: 320 },
      { id: 2, name: 'A2 — BST Algorithms', difficulty: 'Medium', deadline: '2025-02-03', status: 'done', grade: 88, xp: 280 },
      { id: 3, name: 'A3 — Design Patterns', difficulty: 'Hard', deadline: '2025-02-24', status: 'done', grade: 81, xp: 380 },
      { id: 4, name: 'A4 — Multithreading', difficulty: 'Hard', deadline: '2025-03-30', status: 'submitted', grade: null, xp: null },
    ],
  },
  2: {
    name: 'MATH 235 — Linear Algebra',
    instructor: 'Prof. Jones',
    students: 28,
    color: 'teal',
    userXP: 740,
    userRank: 1,
    userLevel: 6,
    nextLevelXP: 900,
    avgGrade: 91,
    leaderboard: [
      { rank: 1, initials: 'SE', name: 'You (Sarvenaz)', xp: 740, avg: 91, color: 'teal', isYou: true },
      { rank: 2, initials: 'PM', name: 'Priya M.', xp: 690, avg: 88, color: 'violet' },
      { rank: 3, initials: 'CW', name: 'Chris W.', xp: 610, avg: 85, color: 'amber' },
    ],
    assignments: [
      { id: 1, name: 'Assignment 1', difficulty: 'Medium', deadline: '2025-02-10', status: 'done', grade: 91, xp: 260 },
      { id: 2, name: 'Assignment 2', difficulty: 'Hard', deadline: '2025-03-01', status: 'done', grade: 88, xp: 340 },
      { id: 3, name: 'Assignment 3', difficulty: 'Medium', deadline: '2025-04-10', status: 'pending', grade: null, xp: null },
    ],
  },
  3: {
    name: 'ECON 101 — Micro',
    instructor: 'Prof. Lee',
    students: 120,
    color: 'amber',
    userXP: 420,
    userRank: 14,
    userLevel: 4,
    nextLevelXP: 600,
    avgGrade: 83,
    leaderboard: [
      { rank: 1, initials: 'NS', name: 'Nina S.', xp: 890, avg: 96, color: 'violet' },
      { rank: 2, initials: 'AK', name: 'Aarav K.', xp: 820, avg: 93, color: 'teal' },
      { rank: 14, initials: 'SE', name: 'You (Sarvenaz)', xp: 420, avg: 83, color: 'amber', isYou: true },
    ],
    assignments: [
      { id: 1, name: 'Problem Set 1', difficulty: 'Easy', deadline: '2025-02-01', status: 'done', grade: 83, xp: 180 },
      { id: 2, name: 'Midterm Essay', difficulty: 'Hard', deadline: '2025-04-05', status: 'pending', grade: null, xp: null },
    ],
  },
}

const diffColors = {
  Easy: 'bg-green-900 text-green-300',
  Medium: 'bg-amber-900 text-amber-300',
  Hard: 'bg-red-900 text-red-300',
}

const avatarColors = {
  violet: 'bg-violet-800 text-violet-200',
  teal: 'bg-teal-800 text-teal-200',
  amber: 'bg-amber-800 text-amber-200',
  red: 'bg-red-900 text-red-200',
}

const headerColors = {
  violet: 'bg-violet-600',
  teal: 'bg-teal-600',
  amber: 'bg-amber-600',
}

function ClassDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cls = classData[id]
  const [tab, setTab] = useState('assignments')
  const [xp, setXp] = useState(cls.userXP)
  const [purchased, setPurchased] = useState([])
  const [toast, setToast] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [assignments, setAssignments] = useState(cls.assignments)
  const [newAssignment, setNewAssignment] = useState({ name: '', difficulty: 'Medium', deadline: '' })

  if (!cls) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-white">Class not found.</p>
    </div>
  )

  function handleMarkDone(id) {
    const today = new Date().toISOString().split('T')[0]
    setAssignments(assignments.map(a =>
      a.id === id ? { ...a, status: 'submitted', submittedAt: today } : a
    ))
  }

  function handleGradeSubmit(id, grade) {
    setAssignments(assignments.map(a =>
      a.id === id ? { ...a, grade: Number(grade), status: 'done', xp: Math.round((grade / 100) * 200 * (a.difficulty === 'Hard' ? 2 : a.difficulty === 'Medium' ? 1.5 : 1)) } : a
    ))
  }

  const shopItems = [
    { id: 1, name: 'XP Booster', description: 'Double your XP on your next submitted assignment', cost: 300, emoji: '⚡', color: 'violet' },
    { id: 2, name: 'Deadline Shield', description: 'Extend any assignment deadline by 24 hours without penalty', cost: 500, emoji: '🛡️', color: 'teal' },
    { id: 3, name: 'Grade Guard', description: 'Protect your rank if you get a bad grade this week', cost: 400, emoji: '🔒', color: 'amber' },
    { id: 4, name: 'Sabotage', description: "Freeze a rival's XP gains for 24 hours. They get a notification 😈", cost: 600, emoji: '💣', color: 'red' },
    { id: 5, name: 'Streak Repair', description: 'Restore a lost streak as if you never missed a day', cost: 250, emoji: '🔥', color: 'amber' },
    { id: 6, name: 'Bonus XP Drop', description: 'Instantly receive 200 bonus XP right now', cost: 350, emoji: '🎁', color: 'teal' },
  ]

  const shopColors = {
    violet: { card: 'border-violet-800 hover:border-violet-600', emoji: 'bg-violet-900', badge: 'bg-violet-900 text-violet-300', button: 'bg-violet-600 hover:bg-violet-500' },
    teal: { card: 'border-teal-800 hover:border-teal-600', emoji: 'bg-teal-900', badge: 'bg-teal-900 text-teal-300', button: 'bg-teal-600 hover:bg-teal-500' },
    amber: { card: 'border-amber-800 hover:border-amber-600', emoji: 'bg-amber-900', badge: 'bg-amber-900 text-amber-300', button: 'bg-amber-600 hover:bg-amber-500' },
    red: { card: 'border-red-800 hover:border-red-600', emoji: 'bg-red-900', badge: 'bg-red-900 text-red-300', button: 'bg-red-600 hover:bg-red-500' },
  }

  function handleBuy(item) {
    if (xp < item.cost) {
      showToast(`Not enough XP to buy ${item.name}!`, 'error')
      return
    }
    setXp(xp - item.cost)
    setPurchased([...purchased, item.id])
    showToast(`${item.emoji} ${item.name} activated!`, 'success')
  }

  function showToast(message, type) {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  } 

  function handleAddAssignment() {
    if (!newAssignment.name || !newAssignment.deadline) return
    setAssignments([...assignments, {
      id: assignments.length + 1,
      ...newAssignment,
      status: 'pending',
      grade: null,
      xp: null,
    }])
    setNewAssignment({ name: '', difficulty: 'Medium', deadline: '' })
    setShowModal(false)
  }

  const totalXP = assignments.reduce((sum, a) => sum + (a.xp || 0), 0)
  const progressPct = Math.min(Math.round((cls.userXP / cls.nextLevelXP) * 100), 100)

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar active="My Classes" />

      <div className="ml-56 flex-1 flex flex-col">

        {/* Class header banner */}
        <div className={`${headerColors[cls.color]} px-8 py-6`}>
          <button
            onClick={() => navigate('/classes')}
            className="text-white text-sm opacity-70 hover:opacity-100 mb-3 block"
          >
            ← Back to classes
          </button>
          <h1 className="text-white text-2xl font-semibold">{cls.name}</h1>
          <p className="text-white opacity-70 text-sm mt-1">{cls.instructor} · {cls.students} students</p>
        </div>

        <div className="p-8 flex flex-col gap-6">

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-xs mb-2">Your XP</p>
              <p className="text-white text-2xl font-semibold">{cls.userXP}</p>
              <p className="text-violet-400 text-xs mt-1">in this class</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-xs mb-2">Class rank</p>
              <p className="text-white text-2xl font-semibold">#{cls.userRank}</p>
              <p className="text-violet-400 text-xs mt-1">out of {cls.students}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-xs mb-2">Avg grade</p>
              <p className="text-white text-2xl font-semibold">{cls.avgGrade}%</p>
              <p className="text-violet-400 text-xs mt-1">this class</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-xs mb-2">Level</p>
              <p className="text-white text-2xl font-semibold">Lv. {cls.userLevel}</p>
              <p className="text-violet-400 text-xs mt-1">{cls.nextLevelXP - cls.userXP} XP to next</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setTab('assignments')}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${tab === 'assignments' ? 'bg-violet-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'}`}
            >
              Assignments
            </button>
            <button
              onClick={() => setTab('leaderboard')}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${tab === 'leaderboard' ? 'bg-violet-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'}`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setTab('shop')}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${tab === 'shop' ? 'bg-violet-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'}`}
            >
              Point Shop
            </button>
          </div>

          {/* Assignments tab */}
          {tab === 'assignments' && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
                <h2 className="text-white font-medium">Assignments</h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl transition-colors"
                >
                  + Add assignment
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-gray-400 font-normal px-6 py-3">Name</th>
                    <th className="text-left text-gray-400 font-normal px-4 py-3">Difficulty</th>
                    <th className="text-left text-gray-400 font-normal px-4 py-3">Deadline</th>
                    <th className="text-left text-gray-400 font-normal px-4 py-3">Grade</th>
                    <th className="text-left text-gray-400 font-normal px-4 py-3">XP</th>
                    <th className="text-left text-gray-400 font-normal px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(a => (
                    <AssignmentRow key={a.id} assignment={a} onMarkDone={handleMarkDone} onGradeSubmit={handleGradeSubmit} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Leaderboard tab */}
          {tab === 'leaderboard' && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-white font-medium">Class Leaderboard</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-gray-400 font-normal px-6 py-3">Rank</th>
                    <th className="text-left text-gray-400 font-normal px-4 py-3">Student</th>
                    <th className="text-left text-gray-400 font-normal px-4 py-3">Avg Grade</th>
                    <th className="text-left text-gray-400 font-normal px-4 py-3">XP</th>
                  </tr>
                </thead>
                <tbody>
                  {cls.leaderboard.map(player => (
                    <tr
                      key={player.rank}
                      className={`border-b border-gray-800 last:border-0 ${player.isYou ? 'bg-violet-950' : 'hover:bg-gray-800'} transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${player.rank <= 3 ? 'text-violet-400' : 'text-gray-500'}`}>#{player.rank}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${avatarColors[player.color]}`}>
                            {player.initials}
                          </div>
                          <span className={`font-medium ${player.isYou ? 'text-violet-300' : 'text-white'}`}>
                            {player.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`font-medium ${player.avg >= 90 ? 'text-green-400' : player.avg >= 80 ? 'text-violet-400' : 'text-amber-400'}`}>
                          {player.avg}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-violet-400 font-semibold">{player.xp} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Point Shop tab */}
          {tab === 'shop' && (
            <div className="flex flex-col gap-6">

              {/* XP balance */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Your XP balance in this class</p>
                  <p className="text-white text-3xl font-semibold mt-1">{xp} XP</p>
                </div>
                <div className="text-4xl">🏦</div>
              </div>

              {/* Shop items */}
              <div className="grid grid-cols-3 gap-4">
                {shopItems.map(item => {
                  const styles = shopColors[item.color]
                  const bought = purchased.includes(item.id)
                  const canAfford = xp >= item.cost
                  return (
                    <div
                      key={item.id}
                      className={`bg-gray-900 border rounded-2xl p-5 flex flex-col gap-3 transition-colors ${styles.card} ${bought ? 'opacity-50' : ''}`}
                    >
                      <div className={`w-11 h-11 ${styles.emoji} rounded-xl flex items-center justify-center text-2xl`}>
                        {item.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-sm">{item.name}</h3>
                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">{item.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${styles.badge}`}>
                          {item.cost} XP
                        </span>
                        <button
                          onClick={() => handleBuy(item)}
                          disabled={bought || !canAfford}
                          className={`text-xs text-white font-medium px-3 py-1.5 rounded-xl transition-colors ${
                            bought
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : !canAfford
                              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                              : styles.button
                          }`}
                        >
                          {bought ? '✓ Active' : !canAfford ? 'Not enough XP' : 'Buy'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Active boosts */}
              {purchased.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <h2 className="text-white font-medium mb-4">Active boosts</h2>
                  <div className="flex flex-wrap gap-3">
                    {purchased.map(id => {
                      const item = shopItems.find(i => i.id === id)
                      return (
                        <div key={id} className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2">
                          <span>{item.emoji}</span>
                          <span className="text-white text-sm">{item.name}</span>
                          <span className="text-green-400 text-xs font-medium">active</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
        {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-2xl text-white text-sm font-medium z-50 ${
          toast.type === 'success' ? 'bg-violet-600' : 'bg-red-600'
        }`}>
          {toast.message}
        </div>
      )}
      </div>

      {/* Add Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-semibold text-lg">Add assignment</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white text-xl">✕</button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Assignment name</label>
                <input
                  value={newAssignment.name}
                  onChange={e => setNewAssignment({ ...newAssignment, name: e.target.value })}
                  placeholder="e.g. A5 — Final Project"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Difficulty</label>
                <select
                  value={newAssignment.difficulty}
                  onChange={e => setNewAssignment({ ...newAssignment, difficulty: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Deadline</label>
                <input
                  type="date"
                  value={newAssignment.deadline}
                  onChange={e => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>
              <button
                onClick={handleAddAssignment}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-colors mt-2"
              >
                Add assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AssignmentRow({ assignment: a, onMarkDone, onGradeSubmit }) {
  const [gradeInput, setGradeInput] = useState('')
  const [showGradeInput, setShowGradeInput] = useState(false)

  return (
    <tr className="border-b border-gray-800 last:border-0 hover:bg-gray-800 transition-colors">
      <td className="px-6 py-4 text-white font-medium">{a.name}</td>
      <td className="px-4 py-4">
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${diffColors[a.difficulty]}`}>{a.difficulty}</span>
      </td>
      <td className="px-4 py-4 text-gray-400 text-sm">{a.deadline}</td>
      <td className="px-4 py-4">
        {a.grade !== null ? (
          <span className={`text-sm font-semibold ${a.grade >= 90 ? 'text-green-400' : a.grade >= 75 ? 'text-violet-400' : 'text-amber-400'}`}>
            {a.grade}%
          </span>
        ) : showGradeInput ? (
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="0"
              max="100"
              value={gradeInput}
              onChange={e => setGradeInput(e.target.value)}
              placeholder="0-100"
              className="w-20 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-violet-500"
            />
            <button
              onClick={() => { onGradeSubmit(a.id, gradeInput); setShowGradeInput(false) }}
              className="text-xs bg-violet-600 hover:bg-violet-500 text-white px-2 py-1 rounded-lg"
            >
              Save
            </button>
          </div>
        ) : (
          <span className="text-gray-600 text-xs">—</span>
        )}
      </td>
      <td className="px-4 py-4">
        {a.xp !== null ? (
          <span className="text-violet-400 text-sm font-semibold">+{a.xp} XP</span>
        ) : (
          <span className="text-gray-600 text-xs">—</span>
        )}
      </td>
      <td className="px-4 py-4">
        {a.status === 'pending' && (
          <button onClick={() => onMarkDone(a.id)} className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors">
            Mark submitted
          </button>
        )}
        {a.status === 'submitted' && !showGradeInput && (
          <button onClick={() => setShowGradeInput(true)} className="text-xs bg-violet-900 hover:bg-violet-800 border border-violet-700 text-violet-300 px-3 py-1.5 rounded-lg transition-colors">
            Enter grade
          </button>
        )}
        {a.status === 'done' && (
          <span className="text-green-400 text-xs font-medium">✓ Done</span>
        )}
      </td>
    </tr>
  )
}

export default ClassDetail