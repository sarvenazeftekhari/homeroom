import { useState } from 'react'
import Sidebar from './Sidebar'

function Layout({ children, active }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar
        active={active}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <div className={`${collapsed ? 'ml-16' : 'ml-56'} flex-1 transition-all duration-300`}>
        {children}
      </div>
    </div>
  )
}

export default Layout