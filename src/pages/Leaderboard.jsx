import Sidebar from '../components/Sidebar'

const players = [
  { rank: 1, name: 'Aarav K.', initials: 'AK', xp: 3210, level: 11, avg: 94, done: 22, color: 'violet' },
  { rank: 2, name: 'Sara L.', initials: 'SL', xp: 2990, level: 10, avg: 91, done: 20, color: 'teal' },
  { rank: 3, name: 'Mike R.', initials: 'MR', xp: 2760, level: 10, avg: 89, done: 19, color: 'amber' },
  { rank: 4, name: 'Sarvenaz E.', initials: 'SE', xp: 2480, level: 9, avg: 87, done: 17, color: 'violet', isYou: true },
  { rank: 5, name: 'Jake T.', initials: 'JT', xp: 2100, level: 8, avg: 83, done: 15, color: 'red' },
  { rank: 6, name: 'Priya M.', initials: 'PM', xp: 1950, level: 7, avg: 81, done: 14, color: 'teal' },
  { rank: 7, name: 'Chris W.', initials: 'CW', xp: 1800, level: 7, avg: 79, done: 13, color: 'amber' },
  { rank: 8, name: 'Nina S.', initials: 'NS', xp: 1600, level: 6, avg: 76, done: 12, color: 'violet' },
]

const avatarColors = {
  violet: 'bg-violet-800 text-violet-200',
  teal: 'bg-teal-800 text-teal-200',
  amber: 'bg-amber-800 text-amber-200',
  red: 'bg-red-900 text-red-200',
}

function Leaderboard() {
  const top3 = players.slice(0, 3)
  const rest = players.slice(3)

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar active="Leaderboard" />

      <div className="ml-56 flex-1 p-8 flex flex-col gap-8">

        {/* Header */}
        <div>
          <h1 className="text-white text-2xl font-semibold">Leaderboard</h1>
          <p className="text-gray-400 text-sm mt-1">See how you stack up against your classmates</p>
        </div>

        {/* Podium */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-gray-400 text-sm font-medium text-center mb-8 uppercase tracking-widest">Top 3</h2>
          <div className="flex items-end justify-center gap-6">

            {/* 2nd place */}
            <PodiumCard player={top3[1]} height="h-28" crown="🥈" />

            {/* 1st place */}
            <PodiumCard player={top3[0]} height="h-36" crown="🥇" big />

            {/* 3rd place */}
            <PodiumCard player={top3[2]} height="h-20" crown="🥉" />

          </div>
        </div>

        {/* Your standing callout */}
        <div className="bg-violet-950 border border-violet-800 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-violet-700 rounded-full flex items-center justify-center text-violet-200 text-sm font-semibold">
              SE
            </div>
            <div>
              <p className="text-white font-semibold">You are ranked #4 globally</p>
              <p className="text-violet-300 text-sm">730 XP away from #3 — keep going!</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white text-2xl font-semibold">2,480</p>
            <p className="text-violet-400 text-sm">total XP</p>
          </div>
        </div>

        {/* Full rankings table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-400 font-normal px-6 py-4">Rank</th>
                <th className="text-left text-gray-400 font-normal px-4 py-4">Student</th>
                <th className="text-left text-gray-400 font-normal px-4 py-4">Level</th>
                <th className="text-left text-gray-400 font-normal px-4 py-4">Avg Grade</th>
                <th className="text-left text-gray-400 font-normal px-4 py-4">Assignments Done</th>
                <th className="text-left text-gray-400 font-normal px-4 py-4">Total XP</th>
              </tr>
            </thead>
            <tbody>
              {players.map(player => (
                <tr
                  key={player.rank}
                  className={`border-b border-gray-800 last:border-0 transition-colors ${
                    player.isYou ? 'bg-violet-950' : 'hover:bg-gray-800'
                  }`}
                >
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${player.rank <= 3 ? 'text-violet-400' : 'text-gray-500'}`}>
                      #{player.rank}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${avatarColors[player.color]}`}>
                        {player.initials}
                      </div>
                      <span className={`font-medium ${player.isYou ? 'text-violet-300' : 'text-white'}`}>
                        {player.name} {player.isYou && <span className="text-xs text-violet-400 ml-1">(you)</span>}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-400">Lv. {player.level}</td>
                  <td className="px-4 py-4">
                    <span className={`font-medium ${player.avg >= 90 ? 'text-green-400' : player.avg >= 80 ? 'text-violet-400' : 'text-amber-400'}`}>
                      {player.avg}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-400">{player.done}</td>
                  <td className="px-4 py-4 text-violet-400 font-semibold">{player.xp.toLocaleString()} XP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

function PodiumCard({ player, height, crown, big }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-2xl">{crown}</span>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-semibold ${big ? 'text-base' : 'text-sm'} ${avatarColors[player.color]} ${big ? 'ring-2 ring-violet-500' : ''}`}>
        {player.initials}
      </div>
      <div className="text-center">
        <p className={`text-white font-medium ${big ? 'text-base' : 'text-sm'}`}>{player.name}</p>
        <p className="text-violet-400 text-xs mt-0.5">{player.xp.toLocaleString()} XP</p>
      </div>
      <div className={`${height} w-20 bg-gray-800 border border-gray-700 rounded-t-xl flex items-center justify-center`}>
        <span className={`font-bold ${big ? 'text-2xl text-violet-400' : 'text-xl text-gray-400'}`}>
          #{player.rank}
        </span>
      </div>
    </div>
  )
}

export default Leaderboard