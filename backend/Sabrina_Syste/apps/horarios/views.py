from rest_framework import viewsets

from Sabrina_Syste.apps.core.mixins import AuditLogMixin
from Sabrina_Syste.apps.core.permissions import IsAdminOrReadOnly, is_admin, role_name

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

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if is_admin(user):
            return qs
        rol = role_name(user)
        # Docentes see the full school schedule (useful context for planning /
        # spotting lab conflicts). Students and guardians only see what's
        # relevant to them.
        if rol == 'Estudiante':
            return qs.filter(paralelo__estudiantes__usuario=user)
        if rol == 'Representante':
            return qs.filter(paralelo__estudiantes__representantes__usuario=user)
        return qs


class MateriaConsecutivaReglaViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = MateriaConsecutivaRegla.objects.select_related('materia_a', 'materia_b').all()
    serializer_class = MateriaConsecutivaReglaSerializer
    permission_classes = [IsAdminOrReadOnly]


class ConflictoHorarioViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = ConflictoHorario.objects.all().order_by('-fecha_deteccion')
    serializer_class = ConflictoHorarioSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['tipo_conflicto', 'resuelto']
