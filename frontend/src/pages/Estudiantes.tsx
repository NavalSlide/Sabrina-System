import { useMemo } from 'react'
import CrudSection from '@components/CrudSection'
import PageHeader from '@components/PageHeader'
import Tabs from '@components/Tabs'
import { useAuthUser } from '../hooks/useAuthUser'
import { useCrud } from '../hooks/useCrud'
import { useTabParam } from '../hooks/useTabParam'
import { paraleloService, materiaService, periodoLectivoService } from '../services/academicoService'
import { docenteService } from '../services/docentesService'
import { asistenciaService, calificacionService, estudianteService, representanteService } from '../services/estudiantesService'
import { evaluacionService } from '../services/evaluacionesService'
import { usuarioAdminService } from '../services/adminUsuariosService'
import type { Asistencia, Calificacion, Estudiante, Representante } from '../types'

const ESTADOS_ESTUDIANTE = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'graduado', label: 'Graduado' },
  { value: 'retirado', label: 'Retirado' },
]

const ESTADOS_ASISTENCIA = [
  { value: 'presente', label: 'Presente' },
  { value: 'ausente', label: 'Ausente' },
  { value: 'atraso', label: 'Atraso' },
  { value: 'justificado', label: 'Justificado' },
]

export default function Estudiantes() {
  const user = useAuthUser()
  const isAdmin = Boolean(user?.is_admin)
  const isDocente = user?.rol === 'Docente'
  const canManageEstudiantes = isAdmin
  const canManageSeguimiento = isAdmin || isDocente
  const initialTab = useTabParam()

  const estudiantes = useCrud(estudianteService)
  const usuarios = useCrud(usuarioAdminService)
  const paralelos = useCrud(paraleloService)
  const materias = useCrud(materiaService)
  const periodos = useCrud(periodoLectivoService)
  const docentes = useCrud(docenteService)
  const evaluaciones = useCrud(evaluacionService)

  const usuarioOptions = useMemo(
    () => usuarios.items.map((u) => ({ value: u.id, label: `${u.nombres} ${u.apellidos} (${u.email})` })),
    [usuarios.items]
  )
  const paraleloOptions = useMemo(() => paralelos.items.map((p) => ({ value: p.id, label: `${p.curso_nombre} ${p.nombre}` })), [paralelos.items])
  const estudianteOptions = useMemo(() => estudiantes.items.map((e) => ({ value: e.id, label: e.usuario_nombre })), [estudiantes.items])
  const materiaOptions = useMemo(() => materias.items.map((m) => ({ value: m.id, label: m.nombre })), [materias.items])
  const periodoOptions = useMemo(() => periodos.items.map((p) => ({ value: p.id, label: p.nombre })), [periodos.items])
  const docenteOptions = useMemo(() => docentes.items.map((d) => ({ value: d.id, label: d.usuario_nombre })), [docentes.items])
  const evaluacionOptions = useMemo(
    () => evaluaciones.items.map((e) => ({ value: e.id, label: `${e.materia_nombre} · ${e.tipo} · ${e.fecha}` })),
    [evaluaciones.items]
  )

  const reloadAll = () => {
    estudiantes.reload()
    usuarios.reload()
    paralelos.reload()
    materias.reload()
    periodos.reload()
    docentes.reload()
    evaluaciones.reload()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon="graduation-cap"
        eyebrow="Gestion"
        title="Estudiantes"
        description="Matricula, representantes, asistencia y calificaciones."
      />

      <Tabs
        initialTab={initialTab}
        onChange={reloadAll}
        tabs={[
          {
            key: 'estudiantes',
            label: 'Estudiantes',
            content: (
              <CrudSection<Estudiante>
                title="Estudiante"
                service={estudianteService}
                columns={[
                  { key: 'usuario_nombre', label: 'Nombre' },
                  { key: 'usuario_email', label: 'Email' },
                  { key: 'paralelo_nombre', label: 'Paralelo', render: (e) => e.paralelo_nombre ?? '—' },
                  { key: 'estado', label: 'Estado' },
                ]}
                fields={[
                  { name: 'usuario', label: 'Usuario', type: 'select', required: true, options: usuarioOptions, helpText: 'El usuario debe existir previamente (ver modulo Usuarios).' },
                  { name: 'paralelo', label: 'Paralelo', type: 'select', options: paraleloOptions },
                  { name: 'fecha_nacimiento', label: 'Fecha de nacimiento', type: 'date' },
                  { name: 'fecha_ingreso', label: 'Fecha de ingreso', type: 'date' },
                  { name: 'estado', label: 'Estado', type: 'select', options: ESTADOS_ESTUDIANTE },
                ]}
                canWrite={canManageEstudiantes}
                emptyMessage="Todavia no hay estudiantes matriculados."
                emptyIcon="graduation-cap"
              />
            ),
          },
          {
            key: 'representantes',
            label: 'Representantes',
            content: (
              <CrudSection<Representante>
                title="Representante"
                service={representanteService}
                columns={[
                  { key: 'usuario_nombre', label: 'Nombre' },
                  { key: 'parentesco', label: 'Parentesco' },
                  { key: 'estudiantes_nombres', label: 'Representa a', render: (r) => (r.estudiantes_nombres.length ? r.estudiantes_nombres.join(', ') : '—') },
                ]}
                fields={[
                  { name: 'usuario', label: 'Usuario', type: 'select', required: true, options: usuarioOptions, helpText: 'El usuario debe existir previamente (ver modulo Usuarios).' },
                  { name: 'parentesco', label: 'Parentesco', type: 'text', placeholder: 'Madre, padre, tutor...' },
                  { name: 'estudiantes', label: 'Estudiantes que representa', type: 'multiselect', options: estudianteOptions },
                ]}
                canWrite={canManageEstudiantes}
                emptyMessage="Todavia no hay representantes registrados."
                emptyIcon="users"
              />
            ),
          },
          {
            key: 'asistencia',
            label: 'Asistencia',
            content: (
              <CrudSection<Asistencia>
                title="Asistencia"
                service={asistenciaService}
                columns={[
                  { key: 'estudiante_nombre', label: 'Estudiante' },
                  { key: 'paralelo_nombre', label: 'Paralelo' },
                  { key: 'fecha', label: 'Fecha' },
                  { key: 'estado', label: 'Estado' },
                  { key: 'registrado_por_nombre', label: 'Registrado por' },
                ]}
                fields={[
                  { name: 'estudiante', label: 'Estudiante', type: 'select', required: true, options: estudianteOptions },
                  { name: 'paralelo', label: 'Paralelo', type: 'select', required: true, options: paraleloOptions },
                  { name: 'fecha', label: 'Fecha', type: 'date', required: true },
                  { name: 'estado', label: 'Estado', type: 'select', required: true, options: ESTADOS_ASISTENCIA },
                  { name: 'registrado_por', label: 'Registrado por (docente)', type: 'select', options: docenteOptions, helpText: 'Si eres docente se completa automaticamente al dejarlo vacio.' },
                ]}
                canWrite={canManageSeguimiento}
                emptyMessage="Todavia no hay asistencia registrada."
                emptyIcon="clipboard-list"
              />
            ),
          },
          {
            key: 'calificaciones',
            label: 'Calificaciones',
            content: (
              <CrudSection<Calificacion>
                title="Calificacion"
                service={calificacionService}
                columns={[
                  { key: 'estudiante_nombre', label: 'Estudiante' },
                  { key: 'materia_nombre', label: 'Materia' },
                  { key: 'paralelo_nombre', label: 'Paralelo' },
                  { key: 'nota', label: 'Nota' },
                  { key: 'periodo_lectivo_nombre', label: 'Periodo' },
                ]}
                fields={[
                  { name: 'estudiante', label: 'Estudiante', type: 'select', required: true, options: estudianteOptions },
                  { name: 'materia', label: 'Materia', type: 'select', required: true, options: materiaOptions },
                  { name: 'paralelo', label: 'Paralelo', type: 'select', required: true, options: paraleloOptions },
                  { name: 'periodo_lectivo', label: 'Periodo lectivo', type: 'select', required: true, options: periodoOptions },
                  { name: 'nota', label: 'Nota (0-20)', type: 'number', step: '0.01', min: 0, required: true },
                  { name: 'tipo_evaluacion', label: 'Evaluacion asociada (opcional)', type: 'select', options: evaluacionOptions, helpText: 'Vincula esta nota a una evaluacion especifica si corresponde.' },
                  { name: 'docente', label: 'Docente (opcional)', type: 'select', options: docenteOptions, helpText: 'Si eres docente se completa automaticamente al dejarlo vacio.' },
                ]}
                canWrite={canManageSeguimiento}
                emptyMessage="Todavia no hay calificaciones registradas."
                emptyIcon="chart-bar"
              />
            ),
          },
        ].filter((tab) => tab.key !== 'representantes' || isAdmin)}
      />
    </div>
  )
}
