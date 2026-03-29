import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const classes = [
  { id: 1, name: 'CP264: Data Structures II', instructor: 'Prof. Fan', students: 34, rank: 2, xp: 980, pending: 2, color: 'violet' },
  { id: 2, name: 'MA122: Linear Algebra', instructor: 'Prof. Zhang', students: 28, rank: 1, xp: 740, pending: 0, color: 'teal' },
  { id: 3, name: 'EC120: Microeconomics', instructor: 'Prof. Schirle', students: 120, rank: 14, xp: 420, pending: 1, color: 'amber' },
]

const friends = [
  { initials: 'NH', name: 'Nolan H.', status: 'Submitted A4 in CP264', color: 'violet', online: true },
  { initials: 'NF', name: 'Neil F.', status: 'Earned 280 XP in MA122', color: 'teal', online: true },
  { initials: 'BJ', name: 'Ben J.', status: 'Offline', color: 'amber', online: false },
  { initials: 'SE', name: 'Sarv E.', status: 'Completed Midterm Essay', color: 'red', online: true },
]

const upcomingDeadlines = [
  { name: 'A4 - Multithreading', class: 'CP264', deadline: 'Mar 30', urgent: true },
  { name: 'Midterm Essay', class: 'EC120', deadline: 'Apr 5', urgent: true },
  { name: 'Assignment 3', class: 'MA122', deadline: 'Apr 10', urgent: false },
]

const avatarColors = {
  violet: 'bg-violet-800 text-violet-200',
  teal: 'bg-teal-800 text-teal-200',
  amber: 'bg-amber-800 text-amber-200',
  red: 'bg-red-900 text-red-200',
}

const classAccents = {
  violet: { bg: 'bg-violet-600', ring: 'ring-violet-500/20', hover: 'hover:border-violet-600/60', bar: 'bg-violet-500' },
  teal: { bg: 'bg-teal-600', ring: 'ring-teal-500/20', hover: 'hover:border-teal-600/60', bar: 'bg-teal-500' },
  amber: { bg: 'bg-amber-600', ring: 'ring-amber-500/20', hover: 'hover:border-amber-600/60', bar: 'bg-amber-500' },
}

function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar active="Dashboard" />

      <div className="ml-56 flex-1 p-8 flex flex-col gap-7">

        {/* Header */}
        <div className="flex items-center gap-5">
          <img src="/bird.png" alt="HomeRoom mascot" className="w-20 h-20 object-contain drop-shadow-lg" />
          <div>
            <h1 className="text-white text-4xl font-bold tracking-tight">HomeRoom</h1>
            <p className="text-gray-300 text-lg mt-0.5">
              Hey, {localStorage.getItem('hr_first_name') || 'there'} 👋🏻
            </p>
          </div>
        </div>

        {/* My Classes */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-bold text-base tracking-tight">My Classes</h2>
            <button
              onClick={() => navigate('/classes')}
              className="text-violet-400 text-sm hover:text-violet-300 transition-colors font-medium"
            >
              View all →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {classes.map(cls => {
              const accent = classAccents[cls.color]
              return (
                <div
                  key={cls.id}
                  onClick={() => navigate(`/classes/${cls.id}`)}
                  className={`bg-gray-900 border border-gray-800/80 ${accent.hover} rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5`}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-9 h-9 ${accent.bg} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md ring-4 ${accent.ring}`}>
                      {cls.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{cls.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{cls.instructor}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-white font-bold text-base">{cls.xp}</p>
                      <p className="text-gray-500 text-xs mt-0.5">XP earned</p>
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
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-2 gap-5">

          {/* Friends */}
          <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-white font-bold text-base tracking-tight">Friends</h2>
              <button className="text-violet-400 text-sm hover:text-violet-300 transition-colors font-medium">Add friend →</button>
            </div>
            <div className="flex flex-col gap-3.5">
              {friends.map(f => (
                <div key={f.name} className="flex items-center gap-3 group">
                  <div className="relative shrink-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${avatarColors[f.color]}`}>
                      {f.initials}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 ${f.online ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold">{f.name}</p>
                    <p className="text-gray-500 text-xs truncate mt-0.5">{f.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-5">
            <h2 className="text-white font-bold text-base tracking-tight mb-5">Upcoming Deadlines</h2>
            <div className="flex flex-col gap-1">
              {upcomingDeadlines.map(d => (
                <div key={d.name} className="flex items-center justify-between py-3 border-b border-gray-800/60 last:border-0">
                  <div>
                    <p className="text-white text-sm font-semibold">{d.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{d.class}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                    d.urgent
                      ? 'bg-red-500/15 text-red-400 ring-1 ring-red-500/20'
                      : 'bg-gray-800 text-gray-400'
                  }`}>
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