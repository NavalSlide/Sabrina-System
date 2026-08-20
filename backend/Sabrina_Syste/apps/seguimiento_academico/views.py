from django.shortcuts import render
from rest_framework import viewsets

from Sabrina_Syste.apps.core.mixins import AuditLogMixin
from Sabrina_Syste.apps.core.permissions import IsAdminOrReadOnly, IsDocenteOrAdminOrReadOnly, is_admin, role_name

from .models import Asistencia, Calificacion, Estudiante, IndicadorAcademico, Representante
from .serializers import (
    AsistenciaSerializer,
    CalificacionSerializer,
    EstudianteSerializer,
    IndicadorAcademicoSerializer,
    RepresentanteSerializer,
)


def landing(request):
    """Página de inicio bonita y simple para indicar que el backend está corriendo."""
    context = {
        'title': 'Por ahora',
        'status': 'Backend corriendo',
    }
    return render(request, 'seguimiento_academico/landing.html', context)


class EstudianteViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = Estudiante.objects.select_related('usuario', 'paralelo__curso').all().order_by('usuario__apellidos')
    serializer_class = EstudianteSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['paralelo', 'estado']
    search_fields = ['usuario__nombres', 'usuario__apellidos', 'usuario__email']

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if is_admin(user):
            return qs
        if role_name(user) == 'Estudiante':
            return qs.filter(usuario=user)
        if role_name(user) == 'Representante':
            return qs.filter(representantes__usuario=user)
        return qs


class AsistenciaViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = Asistencia.objects.select_related('estudiante__usuario', 'paralelo__curso', 'registrado_por__usuario').all().order_by('-fecha')
    serializer_class = AsistenciaSerializer
    permission_classes = [IsDocenteOrAdminOrReadOnly]
    filterset_fields = ['estudiante', 'paralelo', 'fecha', 'estado']

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if is_admin(user):
            return qs
        if role_name(user) == 'Estudiante':
            return qs.filter(estudiante__usuario=user)
        if role_name(user) == 'Docente':
            return qs.filter(registrado_por__usuario=user)
        if role_name(user) == 'Representante':
            return qs.filter(estudiante__representantes__usuario=user)
        return qs.none()

    def perform_create(self, serializer):
        docente_profile = getattr(self.request.user, 'docente_profile', None)
        if docente_profile and 'registrado_por' not in serializer.validated_data:
            serializer.save(registrado_por=docente_profile)
        else:
            serializer.save()
        self._write_audit('crear', serializer.instance.pk, serializer.data)


class CalificacionViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = Calificacion.objects.select_related(
        'estudiante__usuario', 'materia', 'paralelo__curso', 'docente__usuario', 'periodo_lectivo'
    ).all().order_by('-fecha_registro')
    serializer_class = CalificacionSerializer
    permission_classes = [IsDocenteOrAdminOrReadOnly]
    filterset_fields = ['estudiante', 'materia', 'paralelo', 'periodo_lectivo', 'docente']

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if is_admin(user):
            return qs
        if role_name(user) == 'Estudiante':
            return qs.filter(estudiante__usuario=user)
        if role_name(user) == 'Docente':
            return qs.filter(docente__usuario=user)
        if role_name(user) == 'Representante':
            return qs.filter(estudiante__representantes__usuario=user)
        return qs.none()

    def perform_create(self, serializer):
        docente_profile = getattr(self.request.user, 'docente_profile', None)
        if docente_profile and 'docente' not in serializer.validated_data:
            serializer.save(docente=docente_profile)
        else:
            serializer.save()
        self._write_audit('crear', serializer.instance.pk, serializer.data)


class RepresentanteViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = Representante.objects.select_related('usuario').prefetch_related('estudiantes__usuario').all()
    serializer_class = RepresentanteSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if is_admin(user):
            return qs
        if role_name(user) == 'Representante':
            return qs.filter(usuario=user)
        return qs.none()

    def perform_create(self, serializer):
        super().perform_create(serializer)
        # A representante profile is useless for role-based scoping (which
        # reads Usuario.rol, not "has a Representante row") unless the
        # account's role actually says Representante - keep them in sync,
        # but never downgrade an admin/docente/estudiante-with-other-needs.
        from Sabrina_Syste.apps.usuarios.models import Rol

        usuario = serializer.instance.usuario
        if usuario.rol_id is None or usuario.rol.nombre not in ('Administrador', 'Docente', 'Representante'):
            representante_rol = Rol.objects.filter(nombre='Representante').first()
            if representante_rol:
                usuario.rol = representante_rol
                usuario.save(update_fields=['rol'])


class IndicadorAcademicoViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = IndicadorAcademico.objects.select_related('paralelo__curso', 'docente__usuario', 'materia', 'periodo_lectivo').all().order_by('-fecha_calculo')
    serializer_class = IndicadorAcademicoSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['paralelo', 'docente', 'materia', 'periodo_lectivo']
