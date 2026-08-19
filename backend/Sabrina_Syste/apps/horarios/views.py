from rest_framework import viewsets

from Sabrina_Syste.apps.core.mixins import AuditLogMixin
from Sabrina_Syste.apps.core.permissions import IsAdminOrReadOnly

from .models import BloqueHorario, ConflictoHorario, Horario, MateriaConsecutivaRegla
from .serializers import (
    BloqueHorarioSerializer,
    ConflictoHorarioSerializer,
    HorarioSerializer,
    MateriaConsecutivaReglaSerializer,
)


class BloqueHorarioViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = BloqueHorario.objects.all().order_by('orden', 'hora_inicio')
    serializer_class = BloqueHorarioSerializer
    permission_classes = [IsAdminOrReadOnly]


class HorarioViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = Horario.objects.select_related(
        'paralelo__curso', 'materia', 'docente__usuario', 'laboratorio', 'bloque_horario', 'periodo_lectivo'
    ).all().order_by('dia_semana', 'bloque_horario__orden')
    serializer_class = HorarioSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['paralelo', 'docente', 'laboratorio', 'dia_semana', 'periodo_lectivo', 'estado']


class MateriaConsecutivaReglaViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = MateriaConsecutivaRegla.objects.select_related('materia_a', 'materia_b').all()
    serializer_class = MateriaConsecutivaReglaSerializer
    permission_classes = [IsAdminOrReadOnly]


class ConflictoHorarioViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = ConflictoHorario.objects.all().order_by('-fecha_deteccion')
    serializer_class = ConflictoHorarioSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['tipo_conflicto', 'resuelto']
