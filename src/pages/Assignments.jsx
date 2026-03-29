import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { auth, db } from '../firebase'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'

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

function Assignments() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [classes, setClasses] = useState([])        // { id, name, code, assignments: [] }
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState('all')
  const [newAssignment, setNewAssignment] = useState({
    name: '', classId: '', difficulty: 'Medium', deadline: ''
  })

  const uid = auth.currentUser?.uid

  useEffect(() => {
    if (!uid) { navigate('/login'); return }

    // Listen to classes
    const unsubClasses = onSnapshot(collection(db, 'users', uid, 'classes'), classSnap => {
      const classData = classSnap.docs.map(d => ({ id: d.id, ...d.data(), assignments: [] }))

      // For each class, listen to its assignments subcollection
      const unsubAssignments = classData.map(cls =>
        onSnapshot(collection(db, 'users', uid, 'classes', cls.id, 'assignments'), aSnap => {
          cls.assignments = aSnap.docs.map(d => ({ id: d.id, ...d.data() }))
          setClasses([...classData])
        })
      )

      setLoading(false)
      return () => unsubAssignments.forEach(u => u())
    })

    return () => unsubClasses()
  }, [uid])

  // ── ADD ────────────────────────────────────────────────────────────────
  async function handleAddAssignment() {
    if (!newAssignment.name || !newAssignment.classId || !newAssignment.deadline) return
    await addDoc(collection(db, 'users', uid, 'classes', newAssignment.classId, 'assignments'), {
      name: newAssignment.name,
      difficulty: newAssignment.difficulty,
      deadline: newAssignment.deadline,
      status: 'pending',
      grade: null,
      submittedAt: null,
      xp: null,
      createdAt: serverTimestamp(),
    })
    setNewAssignment({ name: '', classId: '', difficulty: 'Medium', deadline: '' })
    setShowModal(false)
  }

  // ── MARK SUBMITTED ─────────────────────────────────────────────────────
  async function handleMarkDone(classId, assignmentId) {
    const today = new Date().toISOString().split('T')[0]
    await updateDoc(doc(db, 'users', uid, 'classes', classId, 'assignments', assignmentId), {
      status: 'submitted',
      submittedAt: today,
    })
  }

  // ── SUBMIT GRADE ───────────────────────────────────────────────────────
  async function handleGradeSubmit(classId, assignmentId, grade) {
    const cls = classes.find(c => c.id === classId)
    const a = cls.assignments.find(a => a.id === assignmentId)
    const xp = calculateXP(grade, a.difficulty, a.deadline, a.submittedAt)
    await updateDoc(doc(db, 'users', uid, 'classes', classId, 'assignments', assignmentId), {
      grade: Number(grade),
      status: 'done',
      xp,
    })
  }

  // ── STATS (across all classes) ─────────────────────────────────────────
  const allAssignments = classes.flatMap(c => c.assignments)
  const totalXP = allAssignments.reduce((sum, a) => sum + (a.xp || 0), 0)
  const done = allAssignments.filter(a => a.status === 'done').length
  const pending = allAssignments.filter(a => a.status === 'pending').length

  // ── FILTER ─────────────────────────────────────────────────────────────
  const visibleClasses = selectedClass === 'all'
    ? classes
    : classes.filter(c => c.id === selectedClass)

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar active="Assignments" />

      <div className="ml-56 flex-1 p-8 flex flex-col gap-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-semibold">Assignments</h1>
            <p className="text-gray-400 text-sm mt-1">Track, complete and earn XP</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors"
          >
            + Add assignment
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-xs mb-2">Total XP earned</p>
            <p className="text-white text-2xl font-semibold">{totalXP}</p>
            <p className="text-violet-400 text-xs mt-1">from assignments</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-xs mb-2">Completed</p>
            <p className="text-white text-2xl font-semibold">{done}</p>
            <p className="text-green-400 text-xs mt-1">assignments done</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-xs mb-2">Pending</p>
            <p className="text-white text-2xl font-semibold">{pending}</p>
            <p className="text-amber-400 text-xs mt-1">still to do</p>
          </div>
        </div>

        {/* Class filter tabs */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedClass('all')}
            className={`px-4 py-1.5 rounded-xl text-sm transition-colors ${selectedClass === 'all' ? 'bg-violet-600 text-white' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'}`}
          >
            All classes
          </button>
          {classes.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedClass(c.id)}
              className={`px-4 py-1.5 rounded-xl text-sm transition-colors ${selectedClass === c.id ? 'bg-violet-600 text-white' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'}`}
            >
              {c.code || c.name}
            </button>
          ))}
        </div>

        {/* Assignment tables grouped by class */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-500 text-sm">Loading assignments…</p>
          </div>
        ) : visibleClasses.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-500 text-sm">No classes found. Add classes in your profile.</p>
          </div>
        ) : (
          visibleClasses.map(cls => (
            <div key={cls.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              {/* Class header */}
              <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
                <span className="text-white font-semibold">{cls.code}</span>
                {cls.name && <span className="text-gray-500 text-sm">{cls.name}</span>}
                <span className="ml-auto text-gray-600 text-xs">{cls.assignments.length} assignments</span>
              </div>

              {cls.assignments.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-600 text-sm">No assignments yet for this class.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-gray-400 font-normal px-6 py-4">Assignment</th>
                      <th className="text-left text-gray-400 font-normal px-4 py-4">Difficulty</th>
                      <th className="text-left text-gray-400 font-normal px-4 py-4">Deadline</th>
                      <th className="text-left text-gray-400 font-normal px-4 py-4">Grade</th>
                      <th className="text-left text-gray-400 font-normal px-4 py-4">XP</th>
                      <th className="text-left text-gray-400 font-normal px-4 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cls.assignments.map(a => (
                      <AssignmentRow
                        key={a.id}
                        assignment={a}
                        onMarkDone={(assignmentId) => handleMarkDone(cls.id, assignmentId)}
                        onGradeSubmit={(assignmentId, grade) => handleGradeSubmit(cls.id, assignmentId, grade)}
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))
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
                  placeholder="e.g. A1 — Linked List"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Class</label>
                <select
                  value={newAssignment.classId}
                  onChange={e => setNewAssignment({ ...newAssignment, classId: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500"
                >
                  <option value="">Select a class</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.code}{c.name ? ` — ${c.name}` : ''}</option>
                  ))}
                </select>
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

  const diffColors = {
    Easy: 'bg-green-900 text-green-300',
    Medium: 'bg-amber-900 text-amber-300',
    Hard: 'bg-red-900 text-red-300',
  }

  const isOverdue = new Date(a.deadline) < new Date() && a.status === 'pending'

  return (
    <tr className="border-b border-gray-800 last:border-0 hover:bg-gray-800 transition-colors">
      <td className="px-6 py-4 text-white font-medium">{a.name}</td>
      <td className="px-4 py-4">
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${diffColors[a.difficulty]}`}>
          {a.difficulty}
        </span>
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
          <button
            onClick={() => onMarkDone(a.id)}
            className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            Mark submitted
          </button>
        )}
        {a.status === 'submitted' && !showGradeInput && (
          <button
            onClick={() => setShowGradeInput(true)}
            className="text-xs bg-violet-900 hover:bg-violet-800 border border-violet-700 text-violet-300 px-3 py-1.5 rounded-lg transition-colors"
          >
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

export default Assignments