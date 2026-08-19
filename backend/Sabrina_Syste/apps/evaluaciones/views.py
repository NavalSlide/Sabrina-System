from rest_framework import viewsets

from Sabrina_Syste.apps.core.mixins import AuditLogMixin
from Sabrina_Syste.apps.core.permissions import IsAdminOrReadOnly, IsDocenteOrAdminOrReadOnly

from .models import Actividad, ConfiguracionEvaluacion, Evaluacion
from .serializers import ActividadSerializer, ConfiguracionEvaluacionSerializer, EvaluacionSerializer


class ActividadViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = Actividad.objects.all().order_by('fecha')
    serializer_class = ActividadSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['fecha']
    search_fields = ['nombre', 'descripcion']


class EvaluacionViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = Evaluacion.objects.select_related('paralelo__curso', 'materia', 'docente__usuario', 'periodo_lectivo').all().order_by('fecha')
    serializer_class = EvaluacionSerializer
    permission_classes = [IsDocenteOrAdminOrReadOnly]
    filterset_fields = ['paralelo', 'materia', 'docente', 'periodo_lectivo', 'tipo', 'fecha']

    def perform_create(self, serializer):
        docente_profile = getattr(self.request.user, 'docente_profile', None)
        if docente_profile and 'docente' not in serializer.validated_data:
            instance = serializer.save(docente=docente_profile)
        else:
            instance = serializer.save()
        self._write_audit('crear', instance.pk, serializer.data)


class ConfiguracionEvaluacionViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = ConfiguracionEvaluacion.objects.select_related('periodo_lectivo').all()
    serializer_class = ConfiguracionEvaluacionSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['periodo_lectivo']
