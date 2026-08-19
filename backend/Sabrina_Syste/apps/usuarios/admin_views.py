"""DRF admin-management viewsets for usuarios (Rol, Permiso, Usuario CRUD).

Kept separate from views.py, which holds the existing function-based
login/register/logout/me endpoints untouched.
"""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from Sabrina_Syste.apps.core.mixins import AuditLogMixin
from Sabrina_Syste.apps.core.permissions import IsAdmin

from .models import Permiso, Rol, RolPermiso, Usuario
from .serializers import PermisoSerializer, RolPermisoSerializer, RolSerializer, UsuarioAdminSerializer, UsuarioDirectorySerializer


class UsuarioDirectoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only, any-authenticated-user listing used for pickers (message recipient, etc)."""

    queryset = Usuario.objects.filter(activo=True).order_by('nombres', 'apellidos')
    serializer_class = UsuarioDirectorySerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['nombres', 'apellidos', 'email']


class RolViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = Rol.objects.all().order_by('nombre')
    serializer_class = RolSerializer
    permission_classes = [IsAdmin]
    search_fields = ['nombre']


class PermisoViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = Permiso.objects.all().order_by('codigo')
    serializer_class = PermisoSerializer
    permission_classes = [IsAdmin]
    search_fields = ['codigo']


class RolPermisoViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = RolPermiso.objects.select_related('rol', 'permiso').all()
    serializer_class = RolPermisoSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['rol', 'permiso']


class UsuarioAdminViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = Usuario.objects.select_related('rol').all().order_by('-date_joined')
    serializer_class = UsuarioAdminSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['rol', 'activo', 'is_staff']
    search_fields = ['email', 'nombres', 'apellidos']
    audit_module = 'usuarios.usuario'
