from rest_framework import viewsets

from Sabrina_Syste.apps.core.mixins import AuditLogMixin
from Sabrina_Syste.apps.core.permissions import IsAdminOrReadOnly
from Sabrina_Syste.apps.usuarios.models import Rol

from .models import AsignacionDocente, Docente, DisponibilidadDocente, DocenteLaboratorioAutorizado, DocenteMateriaAutorizada
from .serializers import (
    AsignacionDocenteSerializer,
    DisponibilidadDocenteSerializer,
    DocenteLaboratorioAutorizadoSerializer,
    DocenteMateriaAutorizadaSerializer,
    DocenteSerializer,
)


class DocenteViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = Docente.objects.select_related('usuario', 'especialidad').all().order_by('usuario__apellidos')
    serializer_class = DocenteSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['especialidad']
    search_fields = ['usuario__nombres', 'usuario__apellidos', 'usuario__email']

    def perform_create(self, serializer):
        super().perform_create(serializer)
        # A docente profile is useless for permission checks (IsDocenteOrAdminOrReadOnly
        # reads Usuario.rol, not "has a Docente row") unless the account's role
        # actually says Docente - keep them in sync, but never downgrade an admin.
        usuario = serializer.instance.usuario
        if usuario.rol_id is None or usuario.rol.nombre not in ('Administrador', 'Docente'):
            docente_rol = Rol.objects.filter(nombre='Docente').first()
            if docente_rol:
                usuario.rol = docente_rol
                usuario.save(update_fields=['rol'])


class DisponibilidadDocenteViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = DisponibilidadDocente.objects.select_related('docente__usuario').all()
    serializer_class = DisponibilidadDocenteSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['docente', 'dia_semana', 'disponible']


class DocenteMateriaAutorizadaViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = DocenteMateriaAutorizada.objects.select_related('docente__usuario', 'materia').all()
    serializer_class = DocenteMateriaAutorizadaSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['docente', 'materia']


class DocenteLaboratorioAutorizadoViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = DocenteLaboratorioAutorizado.objects.select_related('docente__usuario', 'laboratorio').all()
    serializer_class = DocenteLaboratorioAutorizadoSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['docente', 'laboratorio']


class AsignacionDocenteViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = AsignacionDocente.objects.select_related('docente__usuario', 'curso', 'paralelo', 'materia', 'periodo_lectivo').all()
    serializer_class = AsignacionDocenteSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['docente', 'curso', 'paralelo', 'materia', 'periodo_lectivo']
