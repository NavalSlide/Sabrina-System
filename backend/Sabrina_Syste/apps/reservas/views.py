from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response

from Sabrina_Syste.apps.core.mixins import AuditLogMixin
from Sabrina_Syste.apps.core.permissions import IsAdmin, IsAdminOrReadOnly, IsDocenteOrAdminOrReadOnly, is_admin, role_name
from Sabrina_Syste.apps.notificaciones.models import Notificacion

from .models import RecursoReservable, Reserva
from .serializers import RecursoReservableSerializer, ReservaSerializer


def _notificar_resolucion_reserva(reserva, tipo, titulo, mensaje):
    Notificacion.objects.create(
        usuario_destino=reserva.docente.usuario,
        tipo=tipo,
        titulo=titulo,
        mensaje=mensaje,
        objeto_relacionado=reserva,
    )


class RecursoReservableViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = RecursoReservable.objects.all().order_by('tipo', 'nombre')
    serializer_class = RecursoReservableSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['tipo', 'estado']


class ReservaViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = Reserva.objects.select_related('docente__usuario', 'laboratorio', 'recurso', 'bloque_horario', 'aprobado_por').all().order_by('-fecha_solicitud')
    serializer_class = ReservaSerializer
    permission_classes = [IsDocenteOrAdminOrReadOnly]
    filterset_fields = ['docente', 'laboratorio', 'recurso', 'estado', 'fecha']

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if is_admin(user):
            return qs
        if role_name(user) == 'Docente':
            return qs.filter(docente__usuario=user)
        return qs.none()

    def perform_create(self, serializer):
        docente_profile = getattr(self.request.user, 'docente_profile', None)
        if not docente_profile and not is_admin(self.request.user):
            raise ValidationError('Solo un docente puede solicitar reservas.')
        if docente_profile and 'docente' not in serializer.validated_data:
            instance = serializer.save(docente=docente_profile)
        else:
            instance = serializer.save()
        self._write_audit('crear', instance.pk, serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def aprobar(self, request, pk=None):
        reserva = self.get_object()
        if reserva.estado != 'pendiente':
            raise ValidationError('Solo se pueden aprobar reservas pendientes.')
        reserva.estado = 'aprobada'
        reserva.aprobado_por = request.user
        reserva.fecha_resolucion = timezone.now()
        reserva.save()
        self._write_audit('editar', reserva.pk, {'estado': 'aprobada'})
        _notificar_resolucion_reserva(
            reserva, 'reserva_aprobada', 'Reserva aprobada',
            f"Tu reserva del {reserva.fecha} ({reserva.bloque_horario}) fue aprobada.",
        )
        return Response(ReservaSerializer(reserva).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def rechazar(self, request, pk=None):
        reserva = self.get_object()
        if reserva.estado != 'pendiente':
            raise ValidationError('Solo se pueden rechazar reservas pendientes.')
        reserva.estado = 'rechazada'
        reserva.motivo_rechazo = request.data.get('motivo_rechazo', '')
        reserva.aprobado_por = request.user
        reserva.fecha_resolucion = timezone.now()
        reserva.save()
        self._write_audit('editar', reserva.pk, {'estado': 'rechazada'})
        motivo = f" Motivo: {reserva.motivo_rechazo}" if reserva.motivo_rechazo else ''
        _notificar_resolucion_reserva(
            reserva, 'reserva_rechazada', 'Reserva rechazada',
            f"Tu reserva del {reserva.fecha} ({reserva.bloque_horario}) fue rechazada.{motivo}",
        )
        return Response(ReservaSerializer(reserva).data)

    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        reserva = self.get_object()
        docente_profile = getattr(request.user, 'docente_profile', None)
        if not is_admin(request.user) and (not docente_profile or reserva.docente_id != docente_profile.id):
            raise PermissionDenied('Solo puedes cancelar tus propias reservas.')
        if reserva.estado not in ('pendiente', 'aprobada'):
            raise ValidationError('Esa reserva ya no se puede cancelar.')
        reserva.estado = 'cancelada'
        reserva.fecha_resolucion = timezone.now()
        reserva.save()
        self._write_audit('editar', reserva.pk, {'estado': 'cancelada'})
        return Response(ReservaSerializer(reserva).data)
