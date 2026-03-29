import { useNavigate } from 'react-router-dom'

function Sidebar({ active }) {
  const navigate = useNavigate()

  const firstName = localStorage.getItem('hr_first_name') || 'You'
  const lastName = localStorage.getItem('hr_last_name') || ''
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  const items = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Classes', path: '/classes' },
    { label: 'Friends', path: '/friends' },
  ]

  return (
    <div className="w-56 bg-gray-900 border-r border-gray-800/60 flex flex-col py-5 px-3 fixed h-full">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-900/40">
          HR
        </div>
        <span className="text-white font-bold text-lg tracking-tight">HomeRoom</span>
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-1">
        {items.map(item => (
          <div
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-150 flex items-center gap-3 ${
              active === item.label
                ? 'bg-violet-600 text-white font-semibold shadow-md shadow-violet-900/40'
                : 'text-gray-400 hover:bg-gray-800/80 hover:text-gray-100'
            }`}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* User at bottom */}
      <div
        onClick={() => navigate('/profile')}
        className="mt-auto mx-1 cursor-pointer group"
      >
        <div className="border-t border-gray-800/60 pt-4 flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-800/60 transition-colors">
          <div className="w-8 h-8 bg-violet-700 rounded-full flex items-center justify-center text-violet-100 text-xs font-bold ring-2 ring-violet-500/30">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{firstName} {lastName}</p>
            <p className="text-violet-400 text-xs group-hover:text-violet-300 transition-colors">View profile →</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar