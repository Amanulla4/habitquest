import './AppShell.css'

const navigation = [
  { icon: '🏠', label: 'Home' },
  { icon: '⚔️', label: 'Quests' },
  { icon: '🎯', label: 'Campaigns' },
  { icon: '🗺️', label: 'Journey' },
  { icon: '🧙', label: 'Character' },
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
          {navigation.map((item, index) => (
            <button
              key={item.label}
              className={`nav-item ${index === 0 ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
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
        {navigation.map((item, index) => (
          <button
            key={item.label}
            className={`mobile-nav-item ${
              index === 0 ? 'active' : ''
            }`}
          >
            <span>{item.icon}</span>
            <small>{item.label}</small>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default AppShell