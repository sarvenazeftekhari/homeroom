import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const classData = {
  1: {
    name: 'CP264: Data Structures II',
    instructor: 'Prof. Fan',
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
      { id: 1, name: 'A1 - Linked List', difficulty: 'Easy', deadline: '2025-01-20', status: 'done', grade: 96, xp: 320 },
      { id: 2, name: 'A2 - BST Algorithms', difficulty: 'Medium', deadline: '2025-02-03', status: 'done', grade: 88, xp: 280 },
      { id: 3, name: 'A3 - Design Patterns', difficulty: 'Hard', deadline: '2025-02-24', status: 'done', grade: 81, xp: 380 },
      { id: 4, name: 'A4 - Multithreading', difficulty: 'Hard', deadline: '2025-03-30', status: 'submitted', grade: null, xp: null },
    ],
  },
  2: {
    name: 'MA122: Linear Algebra',
    instructor: 'Prof. Zhang',
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
    name: 'EC120: Microeconomics',
    instructor: 'Prof. Schirle',
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
  Easy: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20',
  Medium: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20',
  Hard: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/20',
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
  amber: 'bg-amber-500',
}

function ClassDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cls = classData[id]
  const [tab, setTab] = useState('assignments')
  const [xp, setXp] = useState(cls?.userXP || 0)
  const [purchased, setPurchased] = useState([])
  const [toast, setToast] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [assignments, setAssignments] = useState(cls?.assignments || [])
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
    violet: { card: 'border-violet-800/60 hover:border-violet-500/60', emoji: 'bg-violet-900/60', badge: 'bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/20', button: 'bg-violet-600 hover:bg-violet-500 shadow-violet-900/30' },
    teal: { card: 'border-teal-800/60 hover:border-teal-500/60', emoji: 'bg-teal-900/60', badge: 'bg-teal-500/15 text-teal-400 ring-1 ring-teal-500/20', button: 'bg-teal-600 hover:bg-teal-500 shadow-teal-900/30' },
    amber: { card: 'border-amber-800/60 hover:border-amber-500/60', emoji: 'bg-amber-900/60', badge: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20', button: 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/30' },
    red: { card: 'border-red-800/60 hover:border-red-500/60', emoji: 'bg-red-900/60', badge: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/20', button: 'bg-red-600 hover:bg-red-500 shadow-red-900/30' },
  }

  function handleBuy(item) {
    if (xp < item.cost) { showToast(`Not enough XP to buy ${item.name}!`, 'error'); return }
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
    setAssignments([...assignments, { id: assignments.length + 1, ...newAssignment, status: 'pending', grade: null, xp: null }])
    setNewAssignment({ name: '', difficulty: 'Medium', deadline: '' })
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar active="My Classes" />

      <div className="ml-56 flex-1 flex flex-col">

        {/* Class header banner */}
        <div className={`${headerColors[cls.color]} px-8 py-7`}>
          <button
            onClick={() => navigate('/classes')}
            className="text-white/70 text-sm hover:text-white mb-4 block transition-colors font-medium"
          >
            ← Back to classes
          </button>
          <h1 className="text-white text-2xl font-bold">{cls.name}</h1>
          <p className="text-white/70 text-sm mt-1 font-medium">{cls.instructor} · {cls.students} students</p>
        </div>

        <div className="p-8 flex flex-col gap-6">

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Your XP', value: cls.userXP, sub: 'in this class' },
              { label: 'Class rank', value: `#${cls.userRank}`, sub: `out of ${cls.students}` },
              { label: 'Avg grade', value: `${cls.avgGrade}%`, sub: 'this class' },
              { label: 'Level', value: `Lv. ${cls.userLevel}`, sub: `${cls.nextLevelXP - cls.userXP} XP to next` },
            ].map(card => (
              <div key={card.label} className="bg-gray-900 border border-gray-800/80 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">{card.label}</p>
                <p className="text-white text-2xl font-bold">{card.value}</p>
                <p className="text-violet-400 text-xs mt-1 font-medium">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-gray-900 border border-gray-800/80 rounded-2xl p-1.5 w-fit">
            {['assignments', 'leaderboard', 'shop'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                  tab === t
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {t === 'shop' ? 'Point Shop' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Assignments tab */}
          {tab === 'assignments' && (
            <div className="bg-gray-900 border border-gray-800/80 rounded-2xl overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800/60">
                <h2 className="text-white font-bold">Assignments</h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl transition-colors font-semibold shadow-lg shadow-violet-900/30"
                >
                  + Add assignment
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800/60">
                    {['Name', 'Difficulty', 'Deadline', 'Grade', 'XP', 'Action'].map(h => (
                      <th key={h} className="text-left text-gray-500 font-semibold text-xs uppercase tracking-wider px-6 py-3 first:pl-6">{h}</th>
                    ))}
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
            <div className="bg-gray-900 border border-gray-800/80 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800/60">
                <h2 className="text-white font-bold">Class Leaderboard</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800/60">
                    {['Rank', 'Student', 'Avg Grade', 'XP'].map(h => (
                      <th key={h} className="text-left text-gray-500 font-semibold text-xs uppercase tracking-wider px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cls.leaderboard.map(player => (
                    <tr
                      key={player.rank}
                      className={`border-b border-gray-800/60 last:border-0 transition-colors ${player.isYou ? 'bg-violet-600/10' : 'hover:bg-gray-800/50'}`}
                    >
                      <td className="px-6 py-4">
                        <span className={`font-bold text-base ${player.rank === 1 ? 'text-amber-400' : player.rank === 2 ? 'text-gray-300' : player.rank === 3 ? 'text-amber-700' : 'text-gray-500'}`}>
                          {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${avatarColors[player.color]}`}>
                            {player.initials}
                          </div>
                          <span className={`font-semibold ${player.isYou ? 'text-violet-300' : 'text-white'}`}>{player.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${player.avg >= 90 ? 'text-emerald-400' : player.avg >= 80 ? 'text-violet-400' : 'text-amber-400'}`}>
                          {player.avg}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-violet-400 font-bold">{player.xp} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Point Shop tab */}
          {tab === 'shop' && (
            <div className="flex flex-col gap-5">
              <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Your XP balance in this class</p>
                  <p className="text-white text-3xl font-bold">{xp} <span className="text-violet-400 text-lg">XP</span></p>
                </div>
                <div className="text-4xl">🏦</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {shopItems.map(item => {
                  const styles = shopColors[item.color]
                  const bought = purchased.includes(item.id)
                  const canAfford = xp >= item.cost
                  return (
                    <div key={item.id} className={`bg-gray-900 border rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 ${styles.card} ${bought ? 'opacity-40' : ''}`}>
                      <div className={`w-11 h-11 ${styles.emoji} rounded-xl flex items-center justify-center text-2xl`}>
                        {item.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-sm">{item.name}</h3>
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed">{item.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${styles.badge}`}>{item.cost} XP</span>
                        <button
                          onClick={() => handleBuy(item)}
                          disabled={bought || !canAfford}
                          className={`text-xs text-white font-bold px-3 py-1.5 rounded-xl transition-all shadow-lg ${
                            bought ? 'bg-gray-700 text-gray-500 cursor-not-allowed shadow-none'
                            : !canAfford ? 'bg-gray-800 text-gray-500 cursor-not-allowed shadow-none'
                            : `${styles.button}`
                          }`}
                        >
                          {bought ? '✓ Active' : !canAfford ? 'Not enough XP' : 'Buy'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {purchased.length > 0 && (
                <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-5">
                  <h2 className="text-white font-bold mb-4">Active boosts</h2>
                  <div className="flex flex-wrap gap-2">
                    {purchased.map(id => {
                      const item = shopItems.find(i => i.id === id)
                      return (
                        <div key={id} className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2">
                          <span>{item.emoji}</span>
                          <span className="text-emerald-300 text-sm font-semibold">{item.name}</span>
                          <span className="text-emerald-500 text-xs">active</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {toast && (
          <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-2xl text-white text-sm font-bold z-50 shadow-2xl ${toast.type === 'success' ? 'bg-violet-600 shadow-violet-900/40' : 'bg-red-600 shadow-red-900/40'}`}>
            {toast.message}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-bold text-lg">Add assignment</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition-colors">✕</button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Assignment name</label>
                <input value={newAssignment.name} onChange={e => setNewAssignment({ ...newAssignment, name: e.target.value })} placeholder="e.g. A5 — Final Project" className="w-full bg-gray-800/80 border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all" />
              </div>
              <div>
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Difficulty</label>
                <select value={newAssignment.difficulty} onChange={e => setNewAssignment({ ...newAssignment, difficulty: e.target.value })} className="w-full bg-gray-800/80 border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-all">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 block">Deadline</label>
                <input type="date" value={newAssignment.deadline} onChange={e => setNewAssignment({ ...newAssignment, deadline: e.target.value })} className="w-full bg-gray-800/80 border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-all" />
              </div>
              <button onClick={handleAddAssignment} className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-violet-900/30 mt-1">
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
    <tr className="border-b border-gray-800/60 last:border-0 hover:bg-gray-800/40 transition-colors">
      <td className="px-6 py-4 text-white font-semibold">{a.name}</td>
      <td className="px-6 py-4">
        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${diffColors[a.difficulty]}`}>{a.difficulty}</span>
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm font-medium">{a.deadline}</td>
      <td className="px-6 py-4">
        {a.grade !== null ? (
          <span className={`text-sm font-bold ${a.grade >= 90 ? 'text-emerald-400' : a.grade >= 75 ? 'text-violet-400' : 'text-amber-400'}`}>{a.grade}%</span>
        ) : showGradeInput ? (
          <div className="flex gap-2 items-center">
            <input type="number" min="0" max="100" value={gradeInput} onChange={e => setGradeInput(e.target.value)} placeholder="0-100" className="w-20 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-violet-500" />
            <button onClick={() => { onGradeSubmit(a.id, gradeInput); setShowGradeInput(false) }} className="text-xs bg-violet-600 hover:bg-violet-500 text-white px-2 py-1 rounded-lg font-semibold">Save</button>
          </div>
        ) : (
          <span className="text-gray-600 text-xs">—</span>
        )}
      </td>
      <td className="px-6 py-4">
        {a.xp !== null ? (
          <span className="text-violet-400 text-sm font-bold">+{a.xp} XP</span>
        ) : (
          <span className="text-gray-600 text-xs">—</span>
        )}
      </td>
      <td className="px-6 py-4">
        {a.status === 'pending' && (
          <button onClick={() => onMarkDone(a.id)} className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700/80 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors font-medium">Mark submitted</button>
        )}
        {a.status === 'submitted' && !showGradeInput && (
          <button onClick={() => setShowGradeInput(true)} className="text-xs bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 text-violet-300 px-3 py-1.5 rounded-lg transition-colors font-semibold">Enter grade</button>
        )}
        {a.status === 'done' && (
          <span className="text-emerald-400 text-xs font-bold">✓ Done</span>
        )}
      </td>
    </tr>
  )
}

export default ClassDetail