import { useMemo } from 'react'
import CrudSection from '@components/CrudSection'
import PageHeader from '@components/PageHeader'
import Tabs from '@components/Tabs'
import { useAuthUser } from '../hooks/useAuthUser'
import { useCrud } from '../hooks/useCrud'
import { useTabParam } from '../hooks/useTabParam'
import {
  cursoService,
  especialidadService,
  jornadaService,
  materiaService,
  paraleloService,
  periodoLectivoService,
  planEstudioService,
} from '../services/academicoService'
import type { Curso, Especialidad, Jornada, Materia, Paralelo, PeriodoLectivo, PlanEstudio } from '../types'

export default function Academico() {
  const user = useAuthUser()
  const canWrite = Boolean(user?.is_admin)
  const initialTab = useTabParam()

  const especialidades = useCrud(especialidadService)
  const cursos = useCrud(cursoService)
  const jornadas = useCrud(jornadaService)
  const periodos = useCrud(periodoLectivoService)
  const materias = useCrud(materiaService)

  const especialidadOptions = useMemo(() => especialidades.items.map((e) => ({ value: e.id, label: e.nombre })), [especialidades.items])
  const cursoOptions = useMemo(() => cursos.items.map((c) => ({ value: c.id, label: c.nombre })), [cursos.items])
  const jornadaOptions = useMemo(() => jornadas.items.map((j) => ({ value: j.id, label: j.nombre })), [jornadas.items])
  const periodoOptions = useMemo(() => periodos.items.map((p) => ({ value: p.id, label: p.nombre })), [periodos.items])
  const materiaOptions = useMemo(() => materias.items.map((m) => ({ value: m.id, label: m.nombre })), [materias.items])

  const reloadAll = () => {
    especialidades.reload()
    cursos.reload()
    jornadas.reload()
    periodos.reload()
    materias.reload()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon="book-open"
        eyebrow="Gestion"
        title="Académico"
        description="Especialidades, cursos, materias, periodos, paralelos y plan de estudio."
      />

      <Tabs
        initialTab={initialTab}
        onChange={reloadAll}
        tabs={[
          {
            key: 'especialidades',
            label: 'Especialidades',
            content: (
              <CrudSection<Especialidad>
                title="Especialidad"
                service={especialidadService}
                columns={[
                  { key: 'nombre', label: 'Nombre' },
                  { key: 'descripcion', label: 'Descripcion' },
                ]}
                fields={[
                  { name: 'nombre', label: 'Nombre', type: 'text', required: true },
                  { name: 'descripcion', label: 'Descripcion', type: 'textarea' },
                ]}
                emptyMessage="Todavia no hay especialidades registradas."
                emptyIcon="graduation-cap"
                canWrite={canWrite}
              />
            ),
          },
          {
            key: 'cursos',
            label: 'Cursos',
            content: (
              <CrudSection<Curso>
                title="Curso"
                service={cursoService}
                columns={[
                  { key: 'nombre', label: 'Nombre' },
                  { key: 'nivel', label: 'Nivel' },
                  { key: 'especialidad_nombre', label: 'Especialidad', render: (c) => c.especialidad_nombre ?? '—' },
                ]}
                fields={[
                  { name: 'nombre', label: 'Nombre', type: 'text', required: true },
                  { name: 'nivel', label: 'Nivel', type: 'text', required: true },
                  { name: 'especialidad', label: 'Especialidad', type: 'select', options: especialidadOptions },
                ]}
                emptyMessage="Todavia no hay cursos registrados."
                emptyIcon="building"
                canWrite={canWrite}
              />
            ),
          },
          {
            key: 'materias',
            label: 'Materias',
            content: (
              <CrudSection<Materia>
                title="Materia"
                service={materiaService}
                columns={[
                  { key: 'nombre', label: 'Nombre' },
                  { key: 'creditos', label: 'Creditos' },
                  { key: 'descripcion', label: 'Descripcion' },
                ]}
                fields={[
                  { name: 'nombre', label: 'Nombre', type: 'text', required: true },
                  { name: 'creditos', label: 'Creditos', type: 'number', min: 1, required: true },
                  { name: 'descripcion', label: 'Descripcion', type: 'textarea' },
                ]}
                emptyMessage="Todavia no hay materias registradas."
                emptyIcon="book-open"
                canWrite={canWrite}
              />
            ),
          },
          {
            key: 'jornadas',
            label: 'Jornadas',
            content: (
              <CrudSection<Jornada>
                title="Jornada"
                service={jornadaService}
                columns={[
                  { key: 'nombre', label: 'Nombre' },
                  { key: 'hora_inicio', label: 'Hora inicio' },
                  { key: 'hora_fin', label: 'Hora fin' },
                ]}
                fields={[
                  { name: 'nombre', label: 'Nombre', type: 'text', required: true },
                  { name: 'hora_inicio', label: 'Hora inicio', type: 'time', required: true },
                  { name: 'hora_fin', label: 'Hora fin', type: 'time', required: true },
                ]}
                emptyMessage="Todavia no hay jornadas registradas."
                emptyIcon="clock"
                canWrite={canWrite}
              />
            ),
          },
          {
            key: 'periodos',
            label: 'Periodos lectivos',
            content: (
              <CrudSection<PeriodoLectivo>
                title="Periodo lectivo"
                service={periodoLectivoService}
                columns={[
                  { key: 'nombre', label: 'Nombre' },
                  { key: 'fecha_inicio', label: 'Inicio' },
                  { key: 'fecha_fin', label: 'Fin' },
                  { key: 'estado', label: 'Estado' },
                ]}
                fields={[
                  { name: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: '2026-2027' },
                  { name: 'fecha_inicio', label: 'Fecha inicio', type: 'date', required: true },
                  { name: 'fecha_fin', label: 'Fecha fin', type: 'date', required: true },
                  {
                    name: 'estado',
                    label: 'Estado',
                    type: 'select',
                    required: true,
                    options: [
                      { value: 'planificado', label: 'Planificado' },
                      { value: 'activo', label: 'Activo' },
                      { value: 'cerrado', label: 'Cerrado' },
                    ],
                  },
                  { name: 'activo', label: 'Periodo activo', type: 'checkbox', helpText: 'Marca este periodo como el vigente' },
                ]}
                emptyMessage="Todavia no hay periodos lectivos registrados."
                emptyIcon="calendar"
                canWrite={canWrite}
              />
            ),
          },
          {
            key: 'paralelos',
            label: 'Paralelos',
            content: (
              <CrudSection<Paralelo>
                title="Paralelo"
                service={paraleloService}
                columns={[
                  { key: 'curso_nombre', label: 'Curso' },
                  { key: 'nombre', label: 'Paralelo' },
                  { key: 'jornada_nombre', label: 'Jornada' },
                  { key: 'periodo_lectivo_nombre', label: 'Periodo' },
                  { key: 'cupo_disponible', label: 'Cupo disponible' },
                ]}
                fields={[
                  { name: 'curso', label: 'Curso', type: 'select', required: true, options: cursoOptions },
                  { name: 'nombre', label: 'Paralelo (ej. A)', type: 'text', required: true },
                  { name: 'jornada', label: 'Jornada', type: 'select', required: true, options: jornadaOptions },
                  { name: 'periodo_lectivo', label: 'Periodo lectivo', type: 'select', required: true, options: periodoOptions },
                  { name: 'capacidad_maxima', label: 'Capacidad maxima', type: 'number', min: 1, required: true },
                ]}
                emptyMessage="Todavia no hay paralelos registrados."
                emptyIcon="users"
                canWrite={canWrite}
              />
            ),
          },
          {
            key: 'plan-estudio',
            label: 'Plan de estudio',
            content: (
              <CrudSection<PlanEstudio>
                title="Plan de estudio"
                service={planEstudioService}
                columns={[
                  { key: 'especialidad_nombre', label: 'Especialidad' },
                  { key: 'curso_nombre', label: 'Curso' },
                  { key: 'materia_nombre', label: 'Materia' },
                  { key: 'periodo_lectivo_nombre', label: 'Periodo' },
                  { key: 'horas_semanales', label: 'Horas/semana' },
                ]}
                fields={[
                  { name: 'especialidad', label: 'Especialidad', type: 'select', required: true, options: especialidadOptions },
                  { name: 'curso', label: 'Curso', type: 'select', required: true, options: cursoOptions },
                  { name: 'materia', label: 'Materia', type: 'select', required: true, options: materiaOptions },
                  { name: 'periodo_lectivo', label: 'Periodo lectivo', type: 'select', required: true, options: periodoOptions },
                  { name: 'horas_semanales', label: 'Horas semanales', type: 'number', min: 1, required: true },
                ]}
                emptyMessage="Todavia no hay planes de estudio registrados."
                emptyIcon="folder"
                canWrite={canWrite}
              />
            ),
          },
        ]}
      />
    </div>
  )
}
