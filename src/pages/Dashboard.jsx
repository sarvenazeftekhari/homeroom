import Sidebar from '../components/Sidebar'

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-950 flex">

      <Sidebar active="Dashboard" />

      {/* Main content */}
      <div className="ml-56 flex-1 p-8 flex flex-col gap-6">

        {/* Top bar */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-semibold">Welcome back, Sarvenaz 👋</h1>
            <p className="text-gray-400 text-sm mt-1">Here's what's going on today</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm border border-gray-700 hover:bg-gray-700 transition-colors">
              Light
            </button>
            <button className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm hover:bg-violet-500 transition-colors">
              Dark
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total XP" value="2,480" sub="+120 this week" />
          <StatCard label="Global Rank" value="#4" sub="Top 12%" />
          <StatCard label="Assignments Done" value="17" sub="3 pending" />
          <StatCard label="Avg Grade" value="87%" sub="A- average" />
        </div>

        {/* XP Progress bar */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <p className="text-white text-sm font-medium">Level 9 — Progress to Level 10</p>
            <p className="text-violet-400 text-sm">2,480 / 3,000 XP</p>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div className="bg-violet-600 h-3 rounded-full" style={{ width: '82%' }}></div>
          </div>
        </div>

        {/* Classes + Leaderboard */}
        <div className="grid grid-cols-2 gap-4">

          {/* Classes */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-white font-medium mb-4">My Classes</h2>
            <ClassRow name="CS 246 — OOP" meta="2 assignments due soon" badge="Due soon" badgeColor="amber" />
            <ClassRow name="MATH 235 — Linear Algebra" meta="Rank #2 in class" badge="#2" badgeColor="violet" />
            <ClassRow name="ECON 101 — Micro" meta="All caught up" badge="Clear" badgeColor="green" />
          </div>

          {/* Leaderboard */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-white font-medium mb-4">Leaderboard</h2>
            <LeaderRow rank="1" initials="AK" name="Aarav K." xp="3,210" color="violet" />
            <LeaderRow rank="2" initials="SL" name="Sara L." xp="2,990" color="teal" />
            <LeaderRow rank="3" initials="MR" name="Mike R." xp="2,760" color="amber" />
            <LeaderRow rank="4" initials="SE" name="You (Sarvenaz)" xp="2,480" color="violet" isYou />
            <LeaderRow rank="5" initials="JT" name="Jake T." xp="2,100" color="red" />
          </div>

        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <p className="text-gray-400 text-xs mb-2">{label}</p>
      <p className="text-white text-2xl font-semibold">{value}</p>
      <p className="text-violet-400 text-xs mt-1">{sub}</p>
    </div>
  )
}

function ClassRow({ name, meta, badge, badgeColor }) {
  const colors = {
    amber: 'bg-amber-900 text-amber-300',
    violet: 'bg-violet-900 text-violet-300',
    green: 'bg-green-900 text-green-300',
  }
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-800 last:border-0">
      <div>
        <p className="text-white text-sm font-medium">{name}</p>
        <p className="text-gray-500 text-xs mt-0.5">{meta}</p>
      </div>
      <span className={`text-xs px-3 py-1 rounded-full font-medium ${colors[badgeColor]}`}>
        {badge}
      </span>
    </div>
  )
}

function LeaderRow({ rank, initials, name, xp, color, isYou }) {
  const colors = {
    violet: 'bg-violet-800 text-violet-200',
    teal: 'bg-teal-800 text-teal-200',
    amber: 'bg-amber-800 text-amber-200',
    red: 'bg-red-900 text-red-200',
  }
  return (
    <div className={`flex items-center gap-3 py-2.5 border-b border-gray-800 last:border-0 ${isYou ? 'bg-violet-950 -mx-2 px-2 rounded-xl' : ''}`}>
      <span className={`text-sm font-semibold w-5 ${parseInt(rank) <= 3 ? 'text-violet-400' : 'text-gray-500'}`}>
        {rank}
      </span>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${colors[color]}`}>
        {initials}
      </div>
      <span className="text-white text-sm flex-1">{name}</span>
      <span className="text-violet-400 text-sm font-medium">{xp} XP</span>
    </div>
  )
}

export default Dashboard