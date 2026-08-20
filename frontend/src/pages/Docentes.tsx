import { useMemo } from 'react'
import CrudSection from '@components/CrudSection'
import PageHeader from '@components/PageHeader'
import Tabs from '@components/Tabs'
import { useAuthUser } from '../hooks/useAuthUser'
import { useCrud } from '../hooks/useCrud'
import { useTabParam } from '../hooks/useTabParam'
import {
  asignacionDocenteService,
  disponibilidadDocenteService,
  docenteLaboratorioAutorizadoService,
  docenteMateriaAutorizadaService,
  docenteService,
} from '../services/docentesService'
import { usuarioAdminService } from '../services/adminUsuariosService'
import { cursoService, especialidadService, materiaService, paraleloService, periodoLectivoService } from '../services/academicoService'
import { laboratorioService } from '../services/laboratoriosService'
import type {
  AsignacionDocente,
  Docente,
  DisponibilidadDocente,
  DocenteLaboratorioAutorizado,
  DocenteMateriaAutorizada,
} from '../types'

const DIAS = [
  { value: 0, label: 'Lunes' },
  { value: 1, label: 'Martes' },
  { value: 2, label: 'Miercoles' },
  { value: 3, label: 'Jueves' },
  { value: 4, label: 'Viernes' },
  { value: 5, label: 'Sabado' },
  { value: 6, label: 'Domingo' },
]

export default function Docentes() {
  const user = useAuthUser()
  const canWrite = Boolean(user?.is_admin)
  const initialTab = useTabParam()

  const docentes = useCrud(docenteService)
  const usuarios = useCrud(usuarioAdminService)
  const especialidades = useCrud(especialidadService)
  const materias = useCrud(materiaService)
  const cursos = useCrud(cursoService)
  const paralelos = useCrud(paraleloService)
  const periodos = useCrud(periodoLectivoService)
  const laboratorios = useCrud(laboratorioService)

  const usuarioOptions = useMemo(
    () => usuarios.items.map((u) => ({ value: u.id, label: `${u.nombres} ${u.apellidos} (${u.email})` })),
    [usuarios.items]
  )
  const especialidadOptions = useMemo(() => especialidades.items.map((e) => ({ value: e.id, label: e.nombre })), [especialidades.items])
  const docenteOptions = useMemo(
    () => docentes.items.map((d) => ({ value: d.id, label: d.usuario_nombre })),
    [docentes.items]
  )
  const materiaOptions = useMemo(() => materias.items.map((m) => ({ value: m.id, label: m.nombre })), [materias.items])
  const cursoOptions = useMemo(() => cursos.items.map((c) => ({ value: c.id, label: c.nombre })), [cursos.items])
  const paraleloOptions = useMemo(() => paralelos.items.map((p) => ({ value: p.id, label: `${p.curso_nombre} ${p.nombre}` })), [paralelos.items])
  const periodoOptions = useMemo(() => periodos.items.map((p) => ({ value: p.id, label: p.nombre })), [periodos.items])
  const laboratorioOptions = useMemo(() => laboratorios.items.map((l) => ({ value: l.id, label: l.nombre })), [laboratorios.items])

  const reloadAll = () => {
    docentes.reload()
    usuarios.reload()
    especialidades.reload()
    materias.reload()
    cursos.reload()
    paralelos.reload()
    periodos.reload()
    laboratorios.reload()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon="users"
        eyebrow="Gestion"
        title="Docentes"
        description="Perfiles docentes, disponibilidad horaria, materias/laboratorios autorizados y asignaciones academicas."
      />

      <Tabs
        initialTab={initialTab}
        onChange={reloadAll}
        tabs={[
          {
            key: 'docentes',
            label: 'Docentes',
            content: (
              <CrudSection<Docente>
                title="Docente"
                service={docenteService}
                columns={[
                  { key: 'usuario_nombre', label: 'Nombre' },
                  { key: 'usuario_email', label: 'Email' },
                  { key: 'especialidad_nombre', label: 'Especialidad', render: (d) => d.especialidad_nombre ?? '—' },
                  { key: 'horas_contratadas_semanales', label: 'Horas/semana' },
                ]}
                fields={[
                  { name: 'usuario', label: 'Usuario', type: 'select', required: true, options: usuarioOptions, helpText: 'El usuario debe existir previamente (ver modulo Usuarios).' },
                  { name: 'especialidad', label: 'Especialidad', type: 'select', options: especialidadOptions },
                  { name: 'horas_contratadas_semanales', label: 'Horas contratadas/semana', type: 'number', min: 0 },
                  { name: 'max_horas_diarias', label: 'Max. horas diarias', type: 'number', min: 1 },
                  { name: 'max_horas_semanales', label: 'Max. horas semanales', type: 'number', min: 1 },
                  { name: 'max_horas_continuas', label: 'Max. horas continuas', type: 'number', min: 1 },
                ]}
                canWrite={canWrite}
                emptyMessage="Todavia no hay docentes registrados."
                emptyIcon="id-card"
              />
            ),
          },
          {
            key: 'disponibilidad',
            label: 'Disponibilidad',
            content: (
              <CrudSection<DisponibilidadDocente>
                title="Disponibilidad"
                service={disponibilidadDocenteService}
                columns={[
                  { key: 'docente_nombre', label: 'Docente' },
                  { key: 'dia_semana', label: 'Dia', render: (d) => DIAS.find((x) => x.value === d.dia_semana)?.label ?? d.dia_semana },
                  { key: 'hora_inicio', label: 'Desde' },
                  { key: 'hora_fin', label: 'Hasta' },
                  { key: 'disponible', label: 'Disponible', render: (d) => (d.disponible ? 'Si' : 'No') },
                ]}
                fields={[
                  { name: 'docente', label: 'Docente', type: 'select', required: true, options: docenteOptions },
                  { name: 'dia_semana', label: 'Dia de la semana', type: 'select', required: true, options: DIAS },
                  { name: 'hora_inicio', label: 'Hora inicio', type: 'time', required: true },
                  { name: 'hora_fin', label: 'Hora fin', type: 'time', required: true },
                  { name: 'disponible', label: 'Disponible', type: 'checkbox' },
                ]}
                canWrite={canWrite}
                emptyMessage="Todavia no hay disponibilidad registrada."
                emptyIcon="clock"
              />
            ),
          },
          {
            key: 'materias-autorizadas',
            label: 'Materias autorizadas',
            content: (
              <CrudSection<DocenteMateriaAutorizada>
                title="Materia autorizada"
                service={docenteMateriaAutorizadaService}
                columns={[
                  { key: 'docente', label: 'Docente', render: (m) => docenteOptions.find((d) => d.value === m.docente)?.label ?? m.docente },
                  { key: 'materia_nombre', label: 'Materia' },
                ]}
                fields={[
                  { name: 'docente', label: 'Docente', type: 'select', required: true, options: docenteOptions },
                  { name: 'materia', label: 'Materia', type: 'select', required: true, options: materiaOptions },
                ]}
                canWrite={canWrite}
                emptyMessage="Todavia no hay materias autorizadas registradas."
                emptyIcon="badge-check"
              />
            ),
          },
          {
            key: 'laboratorios-autorizados',
            label: 'Laboratorios autorizados',
            content: (
              <CrudSection<DocenteLaboratorioAutorizado>
                title="Laboratorio autorizado"
                service={docenteLaboratorioAutorizadoService}
                columns={[
                  { key: 'docente', label: 'Docente', render: (l) => docenteOptions.find((d) => d.value === l.docente)?.label ?? l.docente },
                  { key: 'laboratorio_nombre', label: 'Laboratorio' },
                ]}
                fields={[
                  { name: 'docente', label: 'Docente', type: 'select', required: true, options: docenteOptions },
                  { name: 'laboratorio', label: 'Laboratorio', type: 'select', required: true, options: laboratorioOptions },
                ]}
                canWrite={canWrite}
                emptyMessage="Todavia no hay laboratorios autorizados registrados."
                emptyIcon="flask"
              />
            ),
          },
          {
            key: 'asignaciones',
            label: 'Asignaciones',
            content: (
              <CrudSection<AsignacionDocente>
                title="Asignacion"
                service={asignacionDocenteService}
                columns={[
                  { key: 'docente_nombre', label: 'Docente' },
                  { key: 'materia_nombre', label: 'Materia' },
                  { key: 'paralelo_nombre', label: 'Paralelo' },
                  { key: 'periodo_lectivo_nombre', label: 'Periodo' },
                  { key: 'horas_asignadas', label: 'Horas' },
                ]}
                fields={[
                  { name: 'docente', label: 'Docente', type: 'select', required: true, options: docenteOptions },
                  { name: 'curso', label: 'Curso', type: 'select', required: true, options: cursoOptions },
                  { name: 'paralelo', label: 'Paralelo', type: 'select', required: true, options: paraleloOptions },
                  { name: 'materia', label: 'Materia', type: 'select', required: true, options: materiaOptions },
                  { name: 'periodo_lectivo', label: 'Periodo lectivo', type: 'select', required: true, options: periodoOptions },
                  { name: 'horas_asignadas', label: 'Horas asignadas', type: 'number', min: 1, required: true },
                ]}
                canWrite={canWrite}
                emptyMessage="Todavia no hay asignaciones registradas."
                emptyIcon="clipboard-list"
              />
            ),
          },
        ]}
      />
    </div>
  )
}
