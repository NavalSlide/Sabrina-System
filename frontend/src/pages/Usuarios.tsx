import { useMemo } from 'react'
import CrudSection from '@components/CrudSection'
import PageHeader from '@components/PageHeader'
import Tabs from '@components/Tabs'
import { useAuthUser } from '../hooks/useAuthUser'
import { useCrud } from '../hooks/useCrud'
import { useTabParam } from '../hooks/useTabParam'
import { permisoService, rolPermisoService, rolService, usuarioAdminService } from '../services/adminUsuariosService'
import type { Permiso, Rol, RolPermiso, Usuario } from '../types'

export default function Usuarios() {
  const user = useAuthUser()
  const canWrite = Boolean(user?.is_admin)
  const initialTab = useTabParam()

  const roles = useCrud(rolService)
  const permisos = useCrud(permisoService)
  const rolOptions = useMemo(() => roles.items.map((r) => ({ value: r.id, label: r.nombre })), [roles.items])
  const permisoOptions = useMemo(() => permisos.items.map((p) => ({ value: p.id, label: p.codigo })), [permisos.items])

  const reloadAll = () => {
    roles.reload()
    permisos.reload()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon="user-circle"
        eyebrow="Seguridad"
        title="Usuarios"
        description="Cuentas, roles y permisos del sistema. Solo administradores."
      />

      <Tabs
        initialTab={initialTab}
        onChange={reloadAll}
        tabs={[
          {
            key: 'usuarios',
            label: 'Usuarios',
            content: (
              <CrudSection<Usuario>
                title="Usuario"
                service={usuarioAdminService}
                columns={[
                  { key: 'nombres', label: 'Nombre', render: (u) => `${u.nombres} ${u.apellidos}` },
                  { key: 'email', label: 'Email' },
                  { key: 'rol_nombre', label: 'Rol', render: (u) => u.rol_nombre ?? 'Sin asignar' },
                  { key: 'activo', label: 'Activo', render: (u) => (u.activo ? 'Si' : 'No') },
                ]}
                fields={[
                  { name: 'nombres', label: 'Nombres', type: 'text', required: true },
                  { name: 'apellidos', label: 'Apellidos', type: 'text', required: true },
                  { name: 'email', label: 'Email', type: 'email', required: true },
                  { name: 'telefono', label: 'Telefono', type: 'text' },
                  { name: 'rol', label: 'Rol', type: 'select', options: rolOptions },
                  {
                    name: 'password',
                    label: 'Contrasena',
                    type: 'password',
                    requiredOnCreate: true,
                    helpText: 'Obligatoria al crear un usuario nuevo. Dejar vacio al editar para no cambiarla.',
                  },
                  { name: 'activo', label: 'Cuenta activa', type: 'checkbox' },
                ]}
                canWrite={canWrite}
                emptyMessage="Todavia no hay usuarios registrados."
                emptyIcon="user-circle"
              />
            ),
          },
          {
            key: 'roles',
            label: 'Roles',
            content: (
              <CrudSection<Rol>
                title="Rol"
                service={rolService}
                columns={[
                  { key: 'nombre', label: 'Nombre' },
                  { key: 'descripcion', label: 'Descripcion' },
                ]}
                fields={[
                  { name: 'nombre', label: 'Nombre', type: 'text', required: true },
                  { name: 'descripcion', label: 'Descripcion', type: 'textarea' },
                ]}
                canWrite={canWrite}
                emptyMessage="Todavia no hay roles registrados."
                emptyIcon="tag"
              />
            ),
          },
          {
            key: 'permisos',
            label: 'Permisos',
            content: (
              <CrudSection<Permiso>
                title="Permiso"
                service={permisoService}
                columns={[
                  { key: 'codigo', label: 'Codigo' },
                  { key: 'descripcion', label: 'Descripcion' },
                ]}
                fields={[
                  { name: 'codigo', label: 'Codigo', type: 'text', required: true },
                  { name: 'descripcion', label: 'Descripcion', type: 'textarea' },
                ]}
                canWrite={canWrite}
                emptyMessage="Todavia no hay permisos registrados."
                emptyIcon="key"
              />
            ),
          },
          {
            key: 'roles-permisos',
            label: 'Permisos por rol',
            content: (
              <CrudSection<RolPermiso>
                title="Asignacion"
                service={rolPermisoService}
                columns={[
                  { key: 'rol_nombre', label: 'Rol' },
                  { key: 'permiso_codigo', label: 'Permiso' },
                  { key: 'fecha_asignacion', label: 'Asignado el', render: (rp) => new Date(rp.fecha_asignacion).toLocaleDateString() },
                ]}
                fields={[
                  { name: 'rol', label: 'Rol', type: 'select', required: true, options: rolOptions },
                  { name: 'permiso', label: 'Permiso', type: 'select', required: true, options: permisoOptions },
                ]}
                canWrite={canWrite}
                emptyMessage="Ningun rol tiene permisos asignados todavia."
                emptyIcon="badge-check"
              />
            ),
          },
        ]}
      />
    </div>
  )
}
