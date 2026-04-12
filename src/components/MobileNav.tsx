'use client'
import React from 'react'

export type TabType = 'pulse' | 'history' | 'settings'

interface Props {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  historyCount: number
}

export default function MobileNav({ activeTab, onTabChange, historyCount }: Props) {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'pulse',
      label: 'Pulse',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      )
    },
    {
      id: 'history',
      label: 'History',
      icon: (
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20v-6M6 20V10M18 20V4" />
          </svg>
          {historyCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-accent text-[8px] font-bold rounded-full flex items-center justify-center text-white ring-2 ring-base">
              {historyCount}
            </span>
          )}
        </div>
      )
    },
    {
      id: 'settings',
      label: 'Theme',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M12 2v2M12 20v2M20 12h2M2 12h2" />
        </svg>
      )
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 w-full xl:hidden bg-base/80 backdrop-blur-xl border-t border-white/10 z-[100000] flex items-center justify-around px-6 pb-[env(safe-area-inset-bottom,12px)] pt-3 h-auto min-h-[64px]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`
            flex flex-col items-center justify-center gap-1 transition-all duration-300 relative active-scale
            ${activeTab === tab.id ? 'text-accent' : 'text-muted/60'}
          `}
        >
          {activeTab === tab.id && (
            <span className="absolute -top-3 w-12 h-1 bg-accent rounded-full blur-[2px] opacity-40" />
          )}
          <div className={`${activeTab === tab.id ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
            {tab.icon}
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest">
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  )
}
