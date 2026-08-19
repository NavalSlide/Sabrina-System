import { useMemo } from 'react'
import CrudSection from '@components/CrudSection'
import PageHeader from '@components/PageHeader'
import Tabs from '@components/Tabs'
import { useAuthUser } from '../hooks/useAuthUser'
import { useCrud } from '../hooks/useCrud'
import { equipoLaboratorioService, laboratorioService, softwareInstaladoService } from '../services/laboratoriosService'
import type { EquipoLaboratorio, Laboratorio, SoftwareInstalado } from '../types'

const ESTADOS = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'inhabilitado', label: 'Inhabilitado' },
]

export default function Laboratorios() {
  const user = useAuthUser()
  const canWrite = Boolean(user?.is_admin)

  const laboratorios = useCrud(laboratorioService)
  const laboratorioOptions = useMemo(() => laboratorios.items.map((l) => ({ value: l.id, label: l.nombre })), [laboratorios.items])

  const reloadAll = () => {
    laboratorios.reload()
  }

  return (
    <div className="space-y-6">
      <PageHeader icon="flask" eyebrow="Gestion" title="Laboratorios" description="Laboratorios, equipos y software instalado." />

      <Tabs
        onChange={reloadAll}
        tabs={[
          {
            key: 'laboratorios',
            label: 'Laboratorios',
            content: (
              <CrudSection<Laboratorio>
                title="Laboratorio"
                service={laboratorioService}
                columns={[
                  { key: 'nombre', label: 'Nombre' },
                  { key: 'ubicacion', label: 'Ubicacion' },
                  { key: 'capacidad', label: 'Capacidad' },
                  { key: 'estado', label: 'Estado' },
                  { key: 'equipos', label: 'Equipos', render: (l) => String(l.equipos?.length ?? 0) },
                ]}
                fields={[
                  { name: 'nombre', label: 'Nombre', type: 'text', required: true },
                  { name: 'ubicacion', label: 'Ubicacion', type: 'text' },
                  { name: 'capacidad', label: 'Capacidad', type: 'number', min: 0 },
                  { name: 'estado', label: 'Estado', type: 'select', options: ESTADOS },
                ]}
                canWrite={canWrite}
                emptyMessage="Todavia no hay laboratorios registrados."
                emptyIcon="flask"
              />
            ),
          },
          {
            key: 'equipos',
            label: 'Equipos',
            content: (
              <CrudSection<EquipoLaboratorio>
                title="Equipo"
                service={equipoLaboratorioService}
                columns={[
                  { key: 'nombre', label: 'Nombre' },
                  { key: 'cantidad', label: 'Cantidad' },
                  { key: 'estado', label: 'Estado' },
                ]}
                fields={[
                  { name: 'laboratorio', label: 'Laboratorio', type: 'select', required: true, options: laboratorioOptions },
                  { name: 'nombre', label: 'Nombre', type: 'text', required: true },
                  { name: 'cantidad', label: 'Cantidad', type: 'number', min: 1 },
                  { name: 'estado', label: 'Estado', type: 'text', placeholder: 'operativo' },
                ]}
                canWrite={canWrite}
                emptyMessage="Todavia no hay equipos registrados."
                emptyIcon="chip"
              />
            ),
          },
          {
            key: 'software',
            label: 'Software',
            content: (
              <CrudSection<SoftwareInstalado>
                title="Software"
                service={softwareInstaladoService}
                columns={[
                  { key: 'nombre', label: 'Nombre' },
                  { key: 'version', label: 'Version' },
                ]}
                fields={[
                  { name: 'laboratorio', label: 'Laboratorio', type: 'select', required: true, options: laboratorioOptions },
                  { name: 'nombre', label: 'Nombre', type: 'text', required: true },
                  { name: 'version', label: 'Version', type: 'text' },
                ]}
                canWrite={canWrite}
                emptyMessage="Todavia no hay software registrado."
                emptyIcon="box"
              />
            ),
          },
        ]}
      />
    </div>
  )
}
