from rest_framework import viewsets

from Sabrina_Syste.apps.core.mixins import AuditLogMixin
from Sabrina_Syste.apps.core.permissions import IsAdminOrReadOnly

from .models import Curso, Especialidad, Jornada, Materia, Paralelo, PeriodoLectivo, PlanEstudio
from .serializers import (
    CursoSerializer,
    EspecialidadSerializer,
    JornadaSerializer,
    MateriaSerializer,
    ParaleloSerializer,
    PeriodoLectivoSerializer,
    PlanEstudioSerializer,
)


class EspecialidadViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = Especialidad.objects.all().order_by('nombre')
    serializer_class = EspecialidadSerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['nombre', 'fecha_creacion']


class JornadaViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = Jornada.objects.all().order_by('hora_inicio')
    serializer_class = JornadaSerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ['nombre']


class PeriodoLectivoViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = PeriodoLectivo.objects.all().order_by('-fecha_inicio')
    serializer_class = PeriodoLectivoSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['estado', 'activo']
    search_fields = ['nombre']
    ordering_fields = ['fecha_inicio', 'fecha_fin']


class CursoViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = Curso.objects.select_related('especialidad').all().order_by('nombre')
    serializer_class = CursoSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['especialidad', 'nivel']
    search_fields = ['nombre', 'nivel']


class MateriaViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = Materia.objects.all().order_by('nombre')
    serializer_class = MateriaSerializer
    permission_classes = [IsAdminOrReadOnly]
    search_fields = ['nombre', 'descripcion']


class ParaleloViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = Paralelo.objects.select_related('curso', 'jornada', 'periodo_lectivo').all().order_by('curso__nombre', 'nombre')
    serializer_class = ParaleloSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['curso', 'jornada', 'periodo_lectivo']
    search_fields = ['nombre', 'curso__nombre']


class PlanEstudioViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = PlanEstudio.objects.select_related('especialidad', 'curso', 'materia', 'periodo_lectivo').all()
    serializer_class = PlanEstudioSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['especialidad', 'curso', 'materia', 'periodo_lectivo']
