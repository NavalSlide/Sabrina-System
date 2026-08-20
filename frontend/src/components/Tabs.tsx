import { useState, type ReactNode } from 'react'

export interface TabItem {
  key: string
  label: string
  content: ReactNode
}

interface TabsProps {
  tabs: TabItem[]
  /** Fired whenever the active tab changes - lets the parent page refresh
   * cross-tab lookups (e.g. a select fed by data another tab just created). */
  onChange?: (key: string) => void
  /** Opens on this tab instead of the first one (e.g. deep-linked from ?tab=). */
  initialTab?: string
}

export default function Tabs({ tabs, onChange, initialTab }: TabsProps) {
  const [active, setActive] = useState(
    initialTab && tabs.some((t) => t.key === initialTab) ? initialTab : tabs[0]?.key
  )

  const handleSelect = (key: string) => {
    setActive(key)
    onChange?.(key)
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6 border-b border-rose-100 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleSelect(tab.key)}
            className={`px-4 py-2 rounded-t-xl text-sm font-semibold transition-colors ${
              active === tab.key
                ? 'bg-white text-rose-600 border border-rose-100 border-b-white -mb-px shadow-sm'
                : 'text-slate-500 hover:text-rose-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div key={tab.key} className={tab.key === active ? 'block' : 'hidden'}>
          {tab.content}
        </div>
      ))}
    </div>
  )
}
