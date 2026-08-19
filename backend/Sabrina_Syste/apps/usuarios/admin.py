from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Permiso, Rol, RolPermiso, SesionActiva, TokenRecuperacion, Usuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    ordering = ('email',)
    list_display = ('email', 'nombres', 'apellidos', 'rol', 'activo', 'is_staff')
    list_filter = ('rol', 'activo', 'is_staff', 'is_superuser')
    search_fields = ('email', 'nombres', 'apellidos')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Datos personales', {'fields': ('nombres', 'apellidos', 'telefono', 'rol')}),
        ('Estado', {'fields': ('activo', 'intentos_fallidos', 'bloqueado_hasta', 'preferencia_modo_oscuro')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nombres', 'apellidos', 'rol', 'password1', 'password2'),
        }),
    )


@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'descripcion')
    search_fields = ('nombre',)


@admin.register(Permiso)
class PermisoAdmin(admin.ModelAdmin):
    list_display = ('id', 'codigo', 'descripcion')
    search_fields = ('codigo',)


@admin.register(RolPermiso)
class RolPermisoAdmin(admin.ModelAdmin):
    list_display = ('id', 'rol', 'permiso', 'fecha_asignacion')
    list_filter = ('rol',)


@admin.register(SesionActiva)
class SesionActivaAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'ip_origen', 'fecha_inicio', 'activa')
    list_filter = ('activa',)


@admin.register(TokenRecuperacion)
class TokenRecuperacionAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'fecha_expiracion', 'usado')
    list_filter = ('usado',)
