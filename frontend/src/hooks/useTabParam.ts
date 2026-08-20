import { useSearchParams } from 'react-router-dom'

/** Reads ?tab= from the URL so a page's <Tabs> can open directly on a
 * specific section (used by deep links from the admin panel). */
export function useTabParam(): string | undefined {
  const [searchParams] = useSearchParams()
  return searchParams.get('tab') ?? undefined
}
