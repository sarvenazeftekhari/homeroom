import { useNavigate } from 'react-router-dom'

function Sidebar({ active }) {
  const navigate = useNavigate()

  const items = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Classes', path: '/classes' },
    { label: 'Friends', path: '/friends' },
  ]

  return (
    <div className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col p-4 gap-1 fixed h-full">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
          HR
        </div>
        <span className="text-white font-semibold text-lg">HomeRoom</span>
      </div>

      {/* Nav items */}
      {items.map(item => (
        <div
          key={item.label}
          onClick={() => navigate(item.path)}
          className={`px-3 py-2 rounded-xl text-sm cursor-pointer transition-colors ${
            active === item.label
              ? 'bg-violet-600 text-white font-medium'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          {item.label}
        </div>
      ))}

      {/* User at bottom */}
      <div className="mt-auto border-t border-gray-800 pt-4 px-2 flex items-center gap-3">
        <div className="w-8 h-8 bg-violet-800 rounded-full flex items-center justify-center text-violet-200 text-xs font-semibold">
          SE
        </div>
        <div>
          <p className="text-white text-sm font-medium">Sarvenaz E.</p>
          <p className="text-violet-400 text-xs">2,480 XP</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar