import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { auth, db } from '../firebase'
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'

const CARD_COLORS = ['violet', 'teal', 'amber', 'blue', 'rose', 'green']

function Classes() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newClassName, setNewClassName] = useState('')
  const [newClassCode, setNewClassCode] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const uid = auth.currentUser?.uid

  useEffect(() => {
    if (!uid) { navigate('/login'); return }

    // Listen to classes, and for each class listen to its assignments
    const unsubClasses = onSnapshot(collection(db, 'users', uid, 'classes'), classSnap => {
      const classData = classSnap.docs.map((d, i) => ({
        id: d.id,
        ...d.data(),
        assignments: [],
        color: CARD_COLORS[i % CARD_COLORS.length],
      }))

      // For each class, subscribe to its assignments subcollection
      classData.forEach(cls => {
        onSnapshot(collection(db, 'users', uid, 'classes', cls.id, 'assignments'), aSnap => {
          cls.assignments = aSnap.docs.map(d => ({ id: d.id, ...d.data() }))
          setClasses([...classData])
        })
      })

      if (classData.length === 0) {
        setClasses([])
        setLoading(false)
      }
    })

    return () => unsubClasses()
  }, [uid])

  // Stop showing loading once first snapshot arrives
  useEffect(() => {
    if (classes.length > 0) setLoading(false)
  }, [classes])

  async function handleCreateClass() {
    if (!newClassCode.trim()) { setError('Class code is required.'); return }
    setSaving(true)
    setError('')
    try {
      await addDoc(collection(db, 'users', uid, 'classes'), {
        name: newClassName.trim(),
        code: newClassCode.trim(),
        createdAt: serverTimestamp(),
      })
      setNewClassName('')
      setNewClassCode('')
      setShowCreateModal(false)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    }
    setSaving(false)
  }

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
          <button
            onClick={() => { setShowCreateModal(true); setError('') }}
            className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors"
          >
            + Add class
          </button>
        </div>

        {/* Class cards */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-500 text-sm">Loading classes…</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-gray-500 text-sm">No classes yet.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-violet-400 hover:text-violet-300 text-sm"
            >
              + Add your first class
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {classes.map(cls => (
              <ClassCard
                key={cls.id}
                cls={cls}
                onClick={() => navigate(`/classes/${cls.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <Modal title="Add a class" onClose={() => setShowCreateModal(false)}>
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-300 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}
          <label className="text-gray-400 text-sm mb-1 block">Class code</label>
          <input
            value={newClassCode}
            onChange={e => setNewClassCode(e.target.value)}
            placeholder="e.g. CS 246"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 mb-4"
          />
          <label className="text-gray-400 text-sm mb-1 block">Class name <span className="text-gray-600">(optional)</span></label>
          <input
            value={newClassName}
            onChange={e => setNewClassName(e.target.value)}
            placeholder="e.g. Object Oriented Programming"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500 mb-6"
          />
          <button
            onClick={handleCreateClass}
            disabled={saving}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {saving ? 'Saving...' : 'Add class'}
          </button>
        </Modal>
      )}
    </div>
  )
}

function ClassCard({ cls, onClick }) {
  const colorMap = {
    violet: 'bg-violet-600',
    teal: 'bg-teal-600',
    amber: 'bg-amber-600',
    blue: 'bg-blue-600',
    rose: 'bg-rose-600',
    green: 'bg-green-600',
  }

  const assignments = cls.assignments || []
  const totalXP = assignments.reduce((sum, a) => sum + (a.xp || 0), 0)
  const pending = assignments.filter(a => a.status === 'pending').length
  const done = assignments.filter(a => a.status === 'done').length

  const label = cls.code || cls.name || '?'
  const initial = label.charAt(0).toUpperCase()

  return (
    <div
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center gap-6 cursor-pointer hover:border-violet-700 transition-colors"
    >
      <div className={`w-12 h-12 ${colorMap[cls.color]} rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0`}>
        {initial}
      </div>
      <div className="flex-1">
        <h3 className="text-white font-semibold text-base">{cls.code}{cls.name ? ` — ${cls.name}` : ''}</h3>
        <p className="text-gray-500 text-sm mt-0.5">{assignments.length} assignments</p>
      </div>
      <div className="flex gap-8 text-center">
        <div>
          <p className="text-white font-semibold">{totalXP} XP</p>
          <p className="text-gray-500 text-xs mt-0.5">earned</p>
        </div>
        <div>
          <p className="text-white font-semibold">{done}</p>
          <p className="text-gray-500 text-xs mt-0.5">done</p>
        </div>
        <div>
          <p className={`font-semibold ${pending > 0 ? 'text-amber-400' : 'text-green-400'}`}>{pending}</p>
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