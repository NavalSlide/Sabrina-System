import type { SVGProps } from 'react'

export type IconName =
  | 'home'
  | 'book-open'
  | 'users'
  | 'graduation-cap'
  | 'calendar'
  | 'chart-bar'
  | 'flask'
  | 'bookmark'
  | 'bell'
  | 'shield-check'
  | 'user-circle'
  | 'logout'
  | 'check-circle'
  | 'x-circle'
  | 'info-circle'
  | 'plus'
  | 'pencil'
  | 'trash'
  | 'inbox'
  | 'clipboard-list'
  | 'building'
  | 'send'
  | 'mail'
  | 'clock'
  | 'badge-check'
  | 'flag'
  | 'folder'
  | 'tag'
  | 'key'
  | 'id-card'
  | 'check'
  | 'box'
  | 'chip'
  | 'search'
  | 'sliders'
  | 'ban'
  | 'chevron-down'
  | 'menu'
  | 'spark'
  | 'arrow-left'

const paths: Record<IconName, JSX.Element> = {
  home: (
    <>
      <path d="M3 12.2 11.4 5a1 1 0 0 1 1.2 0L21 12.2" />
      <path d="M5 10.5V19a1 1 0 0 0 1 1h4v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5h4a1 1 0 0 0 1-1v-8.5" />
    </>
  ),
  'book-open': (
    <>
      <path d="M12 6.7c-1.6-1.1-4.2-1.6-6.2-1.3-.6.1-1 .6-1 1.2v10.9c0 .7.6 1.2 1.3 1.1 1.9-.3 4.3.1 5.9 1.1" />
      <path d="M12 6.7c1.6-1.1 4.2-1.6 6.2-1.3.6.1 1 .6 1 1.2v10.9c0 .7-.6 1.2-1.3 1.1-1.9-.3-4.3.1-5.9 1.1" />
      <path d="M12 6.7v13" />
    </>
  ),
  users: (
    <>
      <path d="M16.5 20v-1.2a3.8 3.8 0 0 0-3.8-3.8H7.3a3.8 3.8 0 0 0-3.8 3.8V20" />
      <circle cx="10" cy="7.5" r="3.5" />
      <path d="M21.5 20v-1.2a3.6 3.6 0 0 0-2.7-3.5" />
      <path d="M15.8 4.2a3.5 3.5 0 0 1 0 6.6" />
    </>
  ),
  'graduation-cap': (
    <>
      <path d="M2 9 12 4.5 22 9l-10 4.5L2 9Z" />
      <path d="M6.5 11.2v5c0 1.4 2.6 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-5" />
      <path d="M22 9v6.3" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M8 3.2v3.6M16 3.2v3.6M3.5 10h17" />
    </>
  ),
  'chart-bar': (
    <>
      <path d="M4.5 20V11" />
      <path d="M10.5 20V6" />
      <path d="M16.5 20v-8.5" />
      <path d="M3 20.5h18" />
    </>
  ),
  flask: (
    <>
      <path d="M9.3 3h5.4" />
      <path d="M10.2 3v6.4L5 17.8a1.9 1.9 0 0 0 1.6 2.9h10.8a1.9 1.9 0 0 0 1.6-2.9l-5.2-8.4V3" />
      <path d="M7.6 15.2h8.8" />
    </>
  ),
  bookmark: <path d="M6.5 4a1.7 1.7 0 0 1 1.7-1.7h7.6A1.7 1.7 0 0 1 17.5 4v17l-5.5-3.8L6.5 21Z" />,
  bell: (
    <>
      <path d="M18.2 15.8V11a6.2 6.2 0 1 0-12.4 0v4.8l-1.5 2.3a1 1 0 0 0 .8 1.5h13.8a1 1 0 0 0 .8-1.5Z" />
      <path d="M10 19.6a2 2 0 0 0 4 0" />
    </>
  ),
  'shield-check': (
    <>
      <path d="M12 3.2 5.5 5.9v5.4c0 5 2.8 8 6.5 9.5 3.7-1.5 6.5-4.5 6.5-9.5V5.9Z" />
      <path d="m9 12.1 2.1 2.1L15.3 10" />
    </>
  ),
  'user-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3.1" />
      <path d="M6.2 18.8a6.1 6.1 0 0 1 11.6 0" />
    </>
  ),
  logout: (
    <>
      <path d="M9 8V5.6A1.6 1.6 0 0 1 10.6 4H18a1.6 1.6 0 0 1 1.6 1.6v12.8A1.6 1.6 0 0 1 18 20h-7.4A1.6 1.6 0 0 1 9 18.4V16" />
      <path d="M3 12h11.3" />
      <path d="m11 8.6 3.4 3.4L11 15.4" />
    </>
  ),
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.2 12.3 2.5 2.5 5.1-5.5" />
    </>
  ),
  'x-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m9.2 9.2 5.6 5.6M14.8 9.2l-5.6 5.6" />
    </>
  ),
  'info-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11.2v5.3" />
      <path d="M12 8.1h.01" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  pencil: (
    <>
      <path d="m14.8 5.3 3.9 3.9L8.4 19.5H4.5v-3.9Z" />
      <path d="m13 7.1 3.9 3.9" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V4.7A1.4 1.4 0 0 1 10.4 3.3h3.2A1.4 1.4 0 0 1 15 4.7V7" />
      <path d="m17.3 7-.7 11.6A2 2 0 0 1 14.6 20.5H9.4a2 2 0 0 1-2-1.9L6.7 7" />
      <path d="M10.3 10.8v6M13.7 10.8v6" />
    </>
  ),
  inbox: (
    <>
      <path d="M3.3 12.5h4.4l1.3 2.8h6l1.3-2.8h4.4" />
      <path d="M5 5.8h14L21 12.5v5a1.9 1.9 0 0 1-1.9 1.9H4.9A1.9 1.9 0 0 1 3 17.5v-5Z" />
    </>
  ),
  'clipboard-list': (
    <>
      <rect x="5" y="4.3" width="14" height="16.4" rx="2" />
      <path d="M9 3.3h6a1 1 0 0 1 1 1V6H8V4.3a1 1 0 0 1 1-1Z" />
      <path d="M8.3 11.2h7.4M8.3 14.6h7.4M8.3 18h4.4" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="3" width="10.5" height="18" rx="1" />
      <path d="M14.5 8.3H20v12.7h-5.5" />
      <path d="M7.2 7h1M11.3 7h1M7.2 10.4h1M11.3 10.4h1M7.2 13.8h1M11.3 13.8h1M17 11.2h1M17 14.6h1M17 18h1" />
    </>
  ),
  send: <path d="m3 11 18-7.5-7.5 18-2.6-7.9L3 11Z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 6.7 8 6 8-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.3V12l3.1 2" />
    </>
  ),
  'badge-check': (
    <>
      <path d="m9 12.3 2.1 2.1 4.3-4.3" />
      <circle cx="12" cy="12" r="9" />
    </>
  ),
  flag: (
    <>
      <path d="M6 3v18" />
      <path d="M6 4.2h10.7l-2.7 4 2.7 4H6" />
    </>
  ),
  folder: <path d="M3.3 6.8a1.6 1.6 0 0 1 1.6-1.6h4.2l2.1 2.6h8a1.6 1.6 0 0 1 1.6 1.6v9a1.6 1.6 0 0 1-1.6 1.6H4.9a1.6 1.6 0 0 1-1.6-1.6Z" />,
  tag: (
    <>
      <path d="M11.7 3.5H5.3A1.8 1.8 0 0 0 3.5 5.3v6.4c0 .5.2.9.5 1.3l8.2 8.2a1.8 1.8 0 0 0 2.5 0l6.5-6.5a1.8 1.8 0 0 0 0-2.5l-8.2-8.2a1.8 1.8 0 0 0-1.3-.5Z" />
      <circle cx="8.2" cy="8.2" r="1.4" />
    </>
  ),
  key: (
    <>
      <circle cx="7.8" cy="15.3" r="3.7" />
      <path d="M10.4 12.7 19 4.1" />
      <path d="M15.3 7.8 17.6 10.1M18 5.1l2.3 2.3" />
    </>
  ),
  'id-card': (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="12" r="2.1" />
      <path d="M6 16.5c.5-1.6 1.6-2.5 3-2.5s2.5.9 3 2.5" />
      <path d="M14 9.7h4M14 13h4" />
    </>
  ),
  check: <path d="M5 13.2 9.2 17.4 19 6.6" />,
  box: (
    <>
      <path d="M3.5 8.3 12 4.4l8.5 3.9-8.5 3.9-8.5-3.9Z" />
      <path d="M3.5 8.3v7.7L12 20l8.5-4V8.3" />
      <path d="M12 12.2V20" />
    </>
  ),
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M10.3 2.5v3M13.7 2.5v3M10.3 18.5v3M13.7 18.5v3M2.5 10.3h3M2.5 13.7h3M18.5 10.3h3M18.5 13.7h3" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m20 20-4.5-4.5" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 6h9M17 6h3M4 18h3M11 18h9" />
      <circle cx="15" cy="6" r="2.2" />
      <circle cx="7" cy="18" r="2.2" />
    </>
  ),
  ban: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m6.3 6.3 11.4 11.4" />
    </>
  ),
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  menu: <path d="M4 6.5h16M4 12h16M4 17.5h16" />,
  spark: <path d="M12 3.5 13.6 9l5.4 1.6-5.4 1.6L12 17.7l-1.6-5.5L5 10.6 10.4 9Z" />,
  'arrow-left': (
    <>
      <path d="M20 12H4.5" />
      <path d="m10.5 6-6 6 6 6" />
    </>
  ),
}

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  size?: number
}

export default function Icon({ name, size = 20, strokeWidth = 1.75, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  )
}
