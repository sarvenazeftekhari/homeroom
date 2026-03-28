import { useState } from 'react'
import Sidebar from '../components/Sidebar'

const shopItems = [
  {
    id: 1,
    name: 'XP Booster',
    description: 'Double your XP on the next assignment you submit',
    cost: 300,
    emoji: '⚡',
    color: 'violet',
  },
  {
    id: 2,
    name: 'Deadline Shield',
    description: 'Extend any assignment deadline by 24 hours without penalty',
    cost: 500,
    emoji: '🛡️',
    color: 'teal',
  },
  {
    id: 3,
    name: 'Grade Guard',
    description: 'Protect your rank if you get a bad grade this week',
    cost: 400,
    emoji: '🔒',
    color: 'amber',
  },
  {
    id: 4,
    name: 'Sabotage',
    description: 'Freeze a rival\'s XP gains for 24 hours. They get a notification 😈',
    cost: 600,
    emoji: '💣',
    color: 'red',
  },
  {
    id: 5,
    name: 'Streak Repair',
    description: 'Restore a lost streak as if you never missed a day',
    cost: 250,
    emoji: '🔥',
    color: 'amber',
  },
  {
    id: 6,
    name: 'Bonus XP Drop',
    description: 'Instantly receive 200 bonus XP right now',
    cost: 350,
    emoji: '🎁',
    color: 'teal',
  },
]

const colorStyles = {
  violet: {
    card: 'border-violet-800 hover:border-violet-600',
    emoji: 'bg-violet-900',
    badge: 'bg-violet-900 text-violet-300',
    button: 'bg-violet-600 hover:bg-violet-500',
  },
  teal: {
    card: 'border-teal-800 hover:border-teal-600',
    emoji: 'bg-teal-900',
    badge: 'bg-teal-900 text-teal-300',
    button: 'bg-teal-600 hover:bg-teal-500',
  },
  amber: {
    card: 'border-amber-800 hover:border-amber-600',
    emoji: 'bg-amber-900',
    badge: 'bg-amber-900 text-amber-300',
    button: 'bg-amber-600 hover:bg-amber-500',
  },
  red: {
    card: 'border-red-800 hover:border-red-600',
    emoji: 'bg-red-900',
    badge: 'bg-red-900 text-red-300',
    button: 'bg-red-600 hover:bg-red-500',
  },
}

function Shop() {
  const [xp, setXp] = useState(2480)
  const [purchased, setPurchased] = useState([])
  const [toast, setToast] = useState(null)

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

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar active="Point Shop" />

      <div className="ml-56 flex-1 p-8 flex flex-col gap-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-semibold">Point Shop</h1>
            <p className="text-gray-400 text-sm mt-1">Spend your XP on boosters, shields and chaos</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl px-6 py-3 flex items-center gap-3">
            <span className="text-gray-400 text-sm">Your balance</span>
            <span className="text-violet-400 text-xl font-semibold">{xp.toLocaleString()} XP</span>
          </div>
        </div>

        {/* Shop grid */}
        <div className="grid grid-cols-3 gap-4">
          {shopItems.map(item => {
            const styles = colorStyles[item.color]
            const bought = purchased.includes(item.id)
            const canAfford = xp >= item.cost

            return (
              <div
                key={item.id}
                className={`bg-gray-900 border rounded-2xl p-6 flex flex-col gap-4 transition-colors ${styles.card} ${bought ? 'opacity-50' : ''}`}
              >
                {/* Emoji icon */}
                <div className={`w-12 h-12 ${styles.emoji} rounded-xl flex items-center justify-center text-2xl`}>
                  {item.emoji}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-base">{item.name}</h3>
                  <p className="text-gray-400 text-sm mt-1 leading-relaxed">{item.description}</p>
                </div>

                {/* Cost + Buy */}
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${styles.badge}`}>
                    {item.cost} XP
                  </span>
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={bought || !canAfford}
                    className={`text-sm text-white font-medium px-4 py-2 rounded-xl transition-colors ${
                      bought
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : !canAfford
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : styles.button
                    }`}
                  >
                    {bought ? '✓ Activated' : !canAfford ? 'Not enough XP' : 'Buy'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Purchased items */}
        {purchased.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-medium mb-4">Active boosts</h2>
            <div className="flex flex-wrap gap-3">
              {purchased.map(id => {
                const item = shopItems.find(i => i.id === id)
                return (
                  <div key={id} className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2">
                    <span>{item.emoji}</span>
                    <span className="text-white text-sm">{item.name}</span>
                    <span className="text-green-400 text-xs">active</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>

      {/* Toast notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-2xl text-white text-sm font-medium shadow-lg transition-all ${
          toast.type === 'success' ? 'bg-violet-600' : 'bg-red-600'
        }`}>
          {toast.message}
        </div>
      )}

    </div>
  )
}

export default Shop