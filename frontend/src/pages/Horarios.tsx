import { useMemo } from 'react'
import CrudSection from '@components/CrudSection'
import PageHeader from '@components/PageHeader'
import Tabs from '@components/Tabs'
import { useAuthUser } from '../hooks/useAuthUser'
import { useCrud } from '../hooks/useCrud'
import { materiaService, paraleloService, periodoLectivoService } from '../services/academicoService'
import { docenteService } from '../services/docentesService'
import { bloqueHorarioService, horarioService } from '../services/horariosService'
import { laboratorioService } from '../services/laboratoriosService'
import type { BloqueHorario, Horario } from '../types'

const DIAS = [
  { value: 0, label: 'Lunes' },
  { value: 1, label: 'Martes' },
  { value: 2, label: 'Miercoles' },
  { value: 3, label: 'Jueves' },
  { value: 4, label: 'Viernes' },
  { value: 5, label: 'Sabado' },
]

const ESTADOS = [
  { value: 'generado_automatico', label: 'Generado automatico' },
  { value: 'editado_manual', label: 'Editado manual' },
  { value: 'publicado', label: 'Publicado' },
]

export default function Horarios() {
  const user = useAuthUser()
  const canWrite = Boolean(user?.is_admin)

  const bloques = useCrud(bloqueHorarioService)
  const paralelos = useCrud(paraleloService)
  const materias = useCrud(materiaService)
  const docentes = useCrud(docenteService)
  const laboratorios = useCrud(laboratorioService)
  const periodos = useCrud(periodoLectivoService)

  const bloqueOptions = useMemo(() => bloques.items.map((b) => ({ value: b.id, label: `${b.nombre} (${b.hora_inicio}-${b.hora_fin})` })), [bloques.items])
  const paraleloOptions = useMemo(() => paralelos.items.map((p) => ({ value: p.id, label: `${p.curso_nombre} ${p.nombre}` })), [paralelos.items])
  const materiaOptions = useMemo(() => materias.items.map((m) => ({ value: m.id, label: m.nombre })), [materias.items])
  const docenteOptions = useMemo(() => docentes.items.map((d) => ({ value: d.id, label: d.usuario_nombre })), [docentes.items])
  const laboratorioOptions = useMemo(() => laboratorios.items.map((l) => ({ value: l.id, label: l.nombre })), [laboratorios.items])
  const periodoOptions = useMemo(() => periodos.items.map((p) => ({ value: p.id, label: p.nombre })), [periodos.items])

  const reloadAll = () => {
    bloques.reload()
    paralelos.reload()
    materias.reload()
    docentes.reload()
    laboratorios.reload()
    periodos.reload()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon="calendar"
        eyebrow="Gestion"
        title="Horarios"
        description="Bloques horarios y asignacion de clases. El sistema evita choques de docente, paralelo o laboratorio."
      />

      <Tabs
        onChange={reloadAll}
        tabs={[
          {
            key: 'horarios',
            label: 'Horarios',
            content: (
              <CrudSection<Horario>
                title="Horario"
                service={horarioService}
                columns={[
                  { key: 'paralelo_nombre', label: 'Paralelo' },
                  { key: 'materia_nombre', label: 'Materia' },
                  { key: 'docente_nombre', label: 'Docente' },
                  { key: 'dia_semana_display', label: 'Dia' },
                  { key: 'bloque_nombre', label: 'Bloque' },
                  { key: 'laboratorio_nombre', label: 'Laboratorio', render: (h) => h.laboratorio_nombre ?? '—' },
                  { key: 'estado', label: 'Estado' },
                ]}
                fields={[
                  { name: 'paralelo', label: 'Paralelo', type: 'select', required: true, options: paraleloOptions },
                  { name: 'materia', label: 'Materia', type: 'select', required: true, options: materiaOptions },
                  { name: 'docente', label: 'Docente', type: 'select', required: true, options: docenteOptions },
                  { name: 'laboratorio', label: 'Laboratorio (opcional)', type: 'select', options: laboratorioOptions },
                  { name: 'bloque_horario', label: 'Bloque horario', type: 'select', required: true, options: bloqueOptions },
                  { name: 'dia_semana', label: 'Dia de la semana', type: 'select', required: true, options: DIAS },
                  { name: 'periodo_lectivo', label: 'Periodo lectivo', type: 'select', required: true, options: periodoOptions },
                  { name: 'estado', label: 'Estado', type: 'select', options: ESTADOS },
                ]}
                canWrite={canWrite}
                emptyMessage="Todavia no hay horarios generados."
                emptyIcon="calendar"
              />
            ),
          },
          {
            key: 'bloques',
            label: 'Bloques horarios',
            content: (
              <CrudSection<BloqueHorario>
                title="Bloque horario"
                service={bloqueHorarioService}
                columns={[
                  { key: 'nombre', label: 'Nombre' },
                  { key: 'hora_inicio', label: 'Inicio' },
                  { key: 'hora_fin', label: 'Fin' },
                  { key: 'es_receso', label: 'Receso', render: (b) => (b.es_receso ? 'Si' : 'No') },
                  { key: 'orden', label: 'Orden' },
                ]}
                fields={[
                  { name: 'nombre', label: 'Nombre', type: 'text', required: true },
                  { name: 'hora_inicio', label: 'Hora inicio', type: 'time', required: true },
                  { name: 'hora_fin', label: 'Hora fin', type: 'time', required: true },
                  { name: 'orden', label: 'Orden', type: 'number', min: 0 },
                  { name: 'es_receso', label: 'Es receso', type: 'checkbox' },
                ]}
                canWrite={canWrite}
                emptyMessage="Todavia no hay bloques horarios registrados."
                emptyIcon="clock"
              />
            ),
          },
        ]}
      />
    </div>
  )
}
