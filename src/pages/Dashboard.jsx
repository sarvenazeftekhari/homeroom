import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const classes = [
  { id: 1, name: 'CS 246 — OOP', instructor: 'Prof. Smith', students: 34, rank: 2, xp: 980, pending: 2, color: 'violet' },
  { id: 2, name: 'MATH 235 — Linear Algebra', instructor: 'Prof. Jones', students: 28, rank: 1, xp: 740, pending: 0, color: 'teal' },
  { id: 3, name: 'ECON 101 — Micro', instructor: 'Prof. Lee', students: 120, rank: 14, xp: 420, pending: 1, color: 'amber' },
]

const friends = [
  { initials: 'AK', name: 'Aarav K.', status: 'Submitted A4 in CS 246', color: 'violet', online: true },
  { initials: 'SL', name: 'Sara L.', status: 'Earned 280 XP in MATH 235', color: 'teal', online: true },
  { initials: 'MR', name: 'Mike R.', status: 'Offline', color: 'amber', online: false },
  { initials: 'JT', name: 'Jake T.', status: 'Completed Midterm Essay', color: 'red', online: true },
]

const upcomingDeadlines = [
  { name: 'A4 — Multithreading', class: 'CS 246', deadline: 'Mar 30', urgent: true },
  { name: 'Midterm Essay', class: 'ECON 101', deadline: 'Apr 5', urgent: true },
  { name: 'Assignment 1', class: 'MATH 235', deadline: 'Apr 10', urgent: false },
]

const avatarColors = {
  violet: 'bg-violet-800 text-violet-200',
  teal: 'bg-teal-800 text-teal-200',
  amber: 'bg-amber-800 text-amber-200',
  red: 'bg-red-900 text-red-200',
}

const classColors = {
  violet: 'bg-violet-600',
  teal: 'bg-teal-600',
  amber: 'bg-amber-600',
}

function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar active="Dashboard" />

      <div className="ml-56 flex-1 p-8 flex flex-col gap-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-semibold">Hey, Sarvenaz 👋</h1>
            <p className="text-gray-400 text-sm mt-1">Here's what's going on today</p>
          </div>
        </div>

        {/* My Classes */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-semibold text-lg">My Classes</h2>
            <button
              onClick={() => navigate('/classes')}
              className="text-violet-400 text-sm hover:text-violet-300"
            >
              View all →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {classes.map(cls => (
              <div
                key={cls.id}
                onClick={() => navigate(`/classes/${cls.id}`)}
                className="bg-gray-900 border border-gray-800 hover:border-violet-700 rounded-2xl p-5 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 ${classColors[cls.color]} rounded-xl flex items-center justify-center text-white font-bold text-sm`}>
                    {cls.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{cls.name}</p>
                    <p className="text-gray-500 text-xs">{cls.instructor}</p>
                  </div>
                </div>
                <div className="flex justify-between">
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
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section: Friends + Upcoming Deadlines */}
        <div className="grid grid-cols-2 gap-6">

          {/* Friends */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-semibold">Friends</h2>
              <button className="text-violet-400 text-sm hover:text-violet-300">Add friend →</button>
            </div>
            <div className="flex flex-col gap-3">
              {friends.map(f => (
                <div key={f.name} className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${avatarColors[f.color]}`}>
                      {f.initials}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-gray-900 ${f.online ? 'bg-green-400' : 'bg-gray-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{f.name}</p>
                    <p className="text-gray-500 text-xs truncate">{f.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4">Upcoming Deadlines</h2>
            <div className="flex flex-col gap-3">
              {upcomingDeadlines.map(d => (
                <div key={d.name} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div>
                    <p className="text-white text-sm font-medium">{d.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{d.class}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${d.urgent ? 'bg-red-900 text-red-300' : 'bg-gray-800 text-gray-400'}`}>
                    {d.deadline}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard