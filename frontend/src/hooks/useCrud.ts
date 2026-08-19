import { useCallback, useEffect, useState } from 'react'
import type { CrudService } from '../services/crud'
import { extractErrorMessage } from '../utils/errors'

interface UseCrudOptions {
  params?: Record<string, unknown>
}

export function useCrud<T extends { id: number }>(service: CrudService<T>, options: UseCrudOptions = {}) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const paramsKey = JSON.stringify(options.params ?? {})

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await service.list(JSON.parse(paramsKey))
      setItems(res.data)
    } catch (err) {
      setError(extractErrorMessage(err, 'No se pudo cargar la informacion.'))
    } finally {
      setLoading(false)
    }
  }, [service, paramsKey])

  useEffect(() => {
    load()
  }, [load])

  const create = useCallback(
    async (payload: Partial<T>) => {
      setSaving(true)
      try {
        await service.create(payload)
        await load()
      } finally {
        setSaving(false)
      }
    },
    [service, load]
  )

  const update = useCallback(
    async (id: number, payload: Partial<T>) => {
      setSaving(true)
      try {
        await service.update(id, payload)
        await load()
      } finally {
        setSaving(false)
      }
    },
    [service, load]
  )

  const remove = useCallback(
    async (id: number) => {
      setSaving(true)
      try {
        await service.remove(id)
        await load()
      } finally {
        setSaving(false)
      }
    },
    [service, load]
  )

  return { items, loading, error, saving, reload: load, create, update, remove }
}
