import { useMemo } from 'react'
import CrudSection from '@components/CrudSection'
import PageHeader from '@components/PageHeader'
import Tabs from '@components/Tabs'
import { useAuthUser } from '../hooks/useAuthUser'
import { useCrud } from '../hooks/useCrud'
import { useTabParam } from '../hooks/useTabParam'
import { materiaService, paraleloService, periodoLectivoService } from '../services/academicoService'
import { docenteService } from '../services/docentesService'
import { actividadService, configuracionEvaluacionService, evaluacionService } from '../services/evaluacionesService'
import type { Actividad, ConfiguracionEvaluacion, Evaluacion } from '../types'

const TIPOS = [
  { value: 'parcial', label: 'Parcial' },
  { value: 'final', label: 'Final' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'proyecto', label: 'Proyecto' },
]

export default function Evaluaciones() {
  const user = useAuthUser()
  const isAdmin = Boolean(user?.is_admin)
  const canManageEvaluaciones = isAdmin || user?.rol === 'Docente'
  const initialTab = useTabParam()

  const paralelos = useCrud(paraleloService)
  const materias = useCrud(materiaService)
  const periodos = useCrud(periodoLectivoService)
  const docentes = useCrud(docenteService)

  const paraleloOptions = useMemo(() => paralelos.items.map((p) => ({ value: p.id, label: `${p.curso_nombre} ${p.nombre}` })), [paralelos.items])
  const materiaOptions = useMemo(() => materias.items.map((m) => ({ value: m.id, label: m.nombre })), [materias.items])
  const periodoOptions = useMemo(() => periodos.items.map((p) => ({ value: p.id, label: p.nombre })), [periodos.items])
  const docenteOptions = useMemo(() => docentes.items.map((d) => ({ value: d.id, label: d.usuario_nombre })), [docentes.items])

  const reloadAll = () => {
    paralelos.reload()
    materias.reload()
    periodos.reload()
    docentes.reload()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon="chart-bar"
        eyebrow="Gestion"
        title="Evaluaciones"
        description="Evaluaciones por paralelo, actividades institucionales y limites por periodo."
      />

      <Tabs
        initialTab={initialTab}
        onChange={reloadAll}
        tabs={[
          {
            key: 'evaluaciones',
            label: 'Evaluaciones',
            content: (
              <CrudSection<Evaluacion>
                title="Evaluacion"
                service={evaluacionService}
                columns={[
                  { key: 'paralelo_nombre', label: 'Paralelo' },
                  { key: 'materia_nombre', label: 'Materia' },
                  { key: 'tipo', label: 'Tipo' },
                  { key: 'fecha', label: 'Fecha' },
                  { key: 'docente_nombre', label: 'Docente' },
                ]}
                fields={[
                  { name: 'paralelo', label: 'Paralelo', type: 'select', required: true, options: paraleloOptions },
                  { name: 'materia', label: 'Materia', type: 'select', required: true, options: materiaOptions },
                  { name: 'periodo_lectivo', label: 'Periodo lectivo', type: 'select', required: true, options: periodoOptions },
                  { name: 'tipo', label: 'Tipo', type: 'select', required: true, options: TIPOS },
                  { name: 'fecha', label: 'Fecha', type: 'date', required: true },
                  { name: 'descripcion', label: 'Descripcion', type: 'textarea' },
                  { name: 'docente', label: 'Docente (opcional)', type: 'select', options: docenteOptions, helpText: 'Si eres docente se completa automaticamente al dejarlo vacio.' },
                ]}
                canWrite={canManageEvaluaciones}
                emptyMessage="Todavia no hay evaluaciones programadas."
                emptyIcon="chart-bar"
              />
            ),
          },
          {
            key: 'actividades',
            label: 'Actividades',
            content: (
              <CrudSection<Actividad>
                title="Actividad"
                service={actividadService}
                columns={[
                  { key: 'nombre', label: 'Nombre' },
                  { key: 'fecha', label: 'Fecha' },
                  { key: 'descripcion', label: 'Descripcion' },
                ]}
                fields={[
                  { name: 'nombre', label: 'Nombre', type: 'text', required: true },
                  { name: 'fecha', label: 'Fecha', type: 'date', required: true },
                  { name: 'descripcion', label: 'Descripcion', type: 'textarea' },
                ]}
                canWrite={isAdmin}
                emptyMessage="Todavia no hay actividades registradas."
                emptyIcon="flag"
              />
            ),
          },
          {
            key: 'configuracion',
            label: 'Limites por periodo',
            content: (
              <CrudSection<ConfiguracionEvaluacion>
                title="Limite de evaluaciones"
                service={configuracionEvaluacionService}
                columns={[
                  { key: 'periodo_lectivo_nombre', label: 'Periodo' },
                  { key: 'max_evaluaciones_por_dia', label: 'Max. evaluaciones/dia' },
                ]}
                fields={[
                  { name: 'periodo_lectivo', label: 'Periodo lectivo', type: 'select', required: true, options: periodoOptions },
                  { name: 'max_evaluaciones_por_dia', label: 'Max. evaluaciones por dia', type: 'number', min: 1, required: true },
                ]}
                canWrite={isAdmin}
                emptyMessage="Todavia no hay limites configurados. Por defecto se permite 1 evaluacion por dia y paralelo."
                emptyIcon="sliders"
              />
            ),
          },
        ]}
      />
    </div>
  )
}
