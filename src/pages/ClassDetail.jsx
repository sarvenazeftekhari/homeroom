import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { auth, db } from '../firebase'
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'

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

const CARD_COLORS = ['violet', 'teal', 'amber', 'blue', 'rose', 'green']

const headerColors = {
  violet: 'bg-violet-600',
  teal: 'bg-teal-600',
  amber: 'bg-amber-600',
  blue: 'bg-blue-600',
  rose: 'bg-rose-600',
  green: 'bg-green-600',
}

function calculateXP(grade, difficulty, deadline, submittedAt) {
  const difficultyMultiplier = { Easy: 1, Medium: 1.5, Hard: 2 }
  const baseXP = (grade / 100) * 200
  const multiplier = difficultyMultiplier[difficulty] || 1
  const deadlineDate = new Date(deadline)
  const submittedDate = new Date(submittedAt)
  const daysEarly = Math.max(0, (deadlineDate - submittedDate) / (1000 * 60 * 60 * 24))
  const earlyBonus = Math.min(daysEarly * 10, 100)
  return Math.round((baseXP + earlyBonus) * multiplier)
}

function ClassDetail() {
  const { id: classId } = useParams()
  const navigate = useNavigate()
  const uid = auth.currentUser?.uid

  const [cls, setCls] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('assignments')
  const [showModal, setShowModal] = useState(false)
  const [newAssignment, setNewAssignment] = useState({ name: '', difficulty: 'Medium', deadline: '' })
  const [purchased, setPurchased] = useState([])
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!uid) { navigate('/login'); return }

    // Load class doc
    getDoc(doc(db, 'users', uid, 'classes', classId)).then(snap => {
      if (!snap.exists()) { navigate('/classes'); return }
      setCls({ id: snap.id, ...snap.data() })
      setLoading(false)
    })

    // Real-time assignments listener
    const unsub = onSnapshot(
      collection(db, 'users', uid, 'classes', classId, 'assignments'),
      snap => setAssignments(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    return () => unsub()
  }, [uid, classId])

  // ── ADD ────────────────────────────────────────────────────────────────
  async function handleAddAssignment() {
    if (!newAssignment.name || !newAssignment.deadline) return
    await addDoc(collection(db, 'users', uid, 'classes', classId, 'assignments'), {
      ...newAssignment,
      status: 'pending',
      grade: null,
      submittedAt: null,
      xp: null,
      createdAt: serverTimestamp(),
    })
    setNewAssignment({ name: '', difficulty: 'Medium', deadline: '' })
    setShowModal(false)
  }

  // ── MARK SUBMITTED ─────────────────────────────────────────────────────
  async function handleMarkDone(assignmentId) {
    const today = new Date().toISOString().split('T')[0]
    await updateDoc(doc(db, 'users', uid, 'classes', classId, 'assignments', assignmentId), {
      status: 'submitted',
      submittedAt: today,
    })
  }

  // ── SUBMIT GRADE ───────────────────────────────────────────────────────
  async function handleGradeSubmit(assignmentId, grade) {
    const a = assignments.find(a => a.id === assignmentId)
    const xp = calculateXP(grade, a.difficulty, a.deadline, a.submittedAt)
    await updateDoc(doc(db, 'users', uid, 'classes', classId, 'assignments', assignmentId), {
      grade: Number(grade),
      status: 'done',
      xp,
    })
  }

  // ── DERIVED STATS ──────────────────────────────────────────────────────
  const totalXP = assignments.reduce((sum, a) => sum + (a.xp || 0), 0)
  const gradedAssignments = assignments.filter(a => a.grade !== null)
  const avgGrade = gradedAssignments.length > 0
    ? Math.round(gradedAssignments.reduce((sum, a) => sum + a.grade, 0) / gradedAssignments.length)
    : null

  // ── SHOP ───────────────────────────────────────────────────────────────
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
    if (totalXP < item.cost) {
      showToast(`Not enough XP to buy ${item.name}!`, 'error')
      return
    }
    setPurchased(prev => [...prev, item.id])
    showToast(`${item.emoji} ${item.name} activated!`, 'success')
  }

  function showToast(message, type) {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ── COLOR ──────────────────────────────────────────────────────────────
  // Derive a consistent color from the classId so it matches Classes.jsx
  const colorIndex = classId ? classId.charCodeAt(0) % CARD_COLORS.length : 0
  const color = CARD_COLORS[colorIndex]

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-500 text-sm">Loading class…</p>
    </div>
  )

  if (!cls) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-white">Class not found.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar active="My Classes" />

      <div className="ml-56 flex-1 flex flex-col">

        {/* Class header banner */}
        <div className={`${headerColors[color]} px-8 py-6`}>
          <button
            onClick={() => navigate('/classes')}
            className="text-white text-sm opacity-70 hover:opacity-100 mb-3 block"
          >
            ← Back to classes
          </button>
          <h1 className="text-white text-2xl font-semibold">
            {cls.code}{cls.name ? ` — ${cls.name}` : ''}
          </h1>
          <p className="text-white opacity-70 text-sm mt-1">{assignments.length} assignments</p>
        </div>

        <div className="p-8 flex flex-col gap-6">

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-xs mb-2">Total XP</p>
              <p className="text-white text-2xl font-semibold">{totalXP}</p>
              <p className="text-violet-400 text-xs mt-1">in this class</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-xs mb-2">Assignments</p>
              <p className="text-white text-2xl font-semibold">{assignments.length}</p>
              <p className="text-violet-400 text-xs mt-1">total</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-xs mb-2">Avg grade</p>
              <p className="text-white text-2xl font-semibold">{avgGrade !== null ? `${avgGrade}%` : '—'}</p>
              <p className="text-violet-400 text-xs mt-1">graded assignments</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-xs mb-2">Pending</p>
              <p className="text-white text-2xl font-semibold">
                {assignments.filter(a => a.status === 'pending').length}
              </p>
              <p className="text-amber-400 text-xs mt-1">still to do</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {['assignments', 'leaderboard', 'shop'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-violet-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'}`}
              >
                {t === 'shop' ? 'Point Shop' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
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
              {assignments.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-gray-600 text-sm">No assignments yet. Add one to get started!</p>
                </div>
              ) : (
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
                      <AssignmentRow
                        key={a.id}
                        assignment={a}
                        onMarkDone={handleMarkDone}
                        onGradeSubmit={handleGradeSubmit}
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Leaderboard tab — placeholder until you add shared leaderboard logic */}
          {tab === 'leaderboard' && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 flex items-center justify-center">
              <p className="text-gray-500 text-sm">Leaderboard coming soon.</p>
            </div>
          )}

          {/* Point Shop tab */}
          {tab === 'shop' && (
            <div className="flex flex-col gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Your XP balance in this class</p>
                  <p className="text-white text-3xl font-semibold mt-1">{totalXP} XP</p>
                </div>
                <div className="text-4xl">🏦</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {shopItems.map(item => {
                  const styles = shopColors[item.color]
                  const bought = purchased.includes(item.id)
                  const canAfford = totalXP >= item.cost
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
                            bought ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : !canAfford ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
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

  const isOverdue = new Date(a.deadline) < new Date() && a.status === 'pending'

  return (
    <tr className="border-b border-gray-800 last:border-0 hover:bg-gray-800 transition-colors">
      <td className="px-6 py-4 text-white font-medium">{a.name}</td>
      <td className="px-4 py-4">
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${diffColors[a.difficulty]}`}>{a.difficulty}</span>
      </td>
      <td className={`px-4 py-4 text-sm ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
        {a.deadline} {isOverdue && '⚠️'}
      </td>
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