import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/canvas', icon: '🗺️', label: 'Canvas' },
  { to: '/timeline', icon: '📅', label: 'Timeline' },
  { to: '/ventures', icon: '🚀', label: 'Ventures' },
  { to: '/livestock', icon: '🐄', label: 'Livestock' },
  { to: '/money', icon: '💰', label: 'Money' },
  { to: '/tasks', icon: '✅', label: 'Tasks' },
]

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-stretch justify-around bg-soil pb-[env(safe-area-inset-bottom)] md:bottom-0 md:left-0 md:top-14 md:h-auto md:w-16 md:flex-col md:justify-start md:gap-1 md:pb-4 md:pt-2 lg:w-[200px] lg:px-2"
      aria-label="Primary"
    >
      {tabs.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            [
              'flex min-h-[44px] w-full min-w-0 flex-1 flex-col items-center justify-center gap-0.5 border-t-2 px-2 transition-colors md:flex-none md:rounded-lg md:border-l-2 md:border-t-0 md:py-3',
              isActive
                ? 'border-terracotta text-ochre md:border-terracotta'
                : 'border-transparent text-muted',
            ].join(' ')
          }
        >
          <span className="text-[1.3rem] leading-none">{icon}</span>
          <span
            className="max-[379px]:hidden text-[0.6rem] uppercase tracking-[0.5px] md:max-lg:hidden lg:inline"
            style={{ fontSize: '0.6rem' }}
          >
            {label}
          </span>
        </NavLink>
      ))}
    </nav>
  )
}
