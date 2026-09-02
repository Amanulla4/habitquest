import { NavLink } from 'react-router-dom'

import './AppShell.css'

const navigation = [
  { icon: '🏠', label: 'Home', path: '/' },
  { icon: '⚔️', label: 'Quests', path: '/quests' },
  { icon: '🎯', label: 'Campaigns', path: '/campaigns' },
  { icon: '🗺️', label: 'Journey', path: '/journey' },
  { icon: '🧙', label: 'Character', path: '/character' },
]

function AppShell({ children }) {
  return (
    <div className="app-shell">
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">⚔️</div>

          <div>
            <h1>HabitQuest</h1>
            <span>Level up your life</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="player-mini">
            <div className="avatar">🧙</div>

            <div className="player-info">
              <strong>Aman</strong>
              <span>Level 1 • Novice</span>
            </div>

            <button className="settings-button">⚙️</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <button className="menu-button">☰</button>

          <div className="topbar-title">
            <span>HabitQuest</span>
          </div>

          <div className="topbar-actions">
            <button className="icon-button">🔔</button>

            <div className="currency">
              <span>🪙</span>
              <strong>0</strong>
            </div>
          </div>
        </header>

        <div className="page-content">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        {navigation.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `mobile-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span>{item.icon}</span>
            <small>{item.label}</small>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default AppShell