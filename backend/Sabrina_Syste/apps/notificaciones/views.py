from django.db.models import Q
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from Sabrina_Syste.apps.core.mixins import AuditLogMixin
from Sabrina_Syste.apps.core.permissions import IsAdmin

from .models import ConfiguracionNotificacion, Mensaje, Notificacion
from .serializers import ConfiguracionNotificacionSerializer, MensajeSerializer, NotificacionSerializer


class NotificacionViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin,
                           mixins.DestroyModelMixin, viewsets.GenericViewSet):
    serializer_class = NotificacionSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['tipo', 'leida']

    def get_queryset(self):
        return Notificacion.objects.filter(usuario_destino=self.request.user).order_by('-fecha_creacion')

    def get_permissions(self):
        if self.action == 'create':
            return [IsAdmin()]
        return super().get_permissions()

    @action(detail=True, methods=['post'])
    def marcar_leida(self, request, pk=None):
        notificacion = self.get_object()
        notificacion.leida = True
        notificacion.save(update_fields=['leida'])
        return Response(NotificacionSerializer(notificacion).data)

    @action(detail=False, methods=['post'])
    def marcar_todas_leidas(self, request):
        self.get_queryset().filter(leida=False).update(leida=True)
        return Response({'success': True})


class ConfiguracionNotificacionViewSet(viewsets.ModelViewSet):
    serializer_class = ConfiguracionNotificacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ConfiguracionNotificacion.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=False, methods=['get'])
    def mia(self, request):
        config, _ = ConfiguracionNotificacion.objects.get_or_create(usuario=request.user)
        return Response(ConfiguracionNotificacionSerializer(config).data)


class MensajeViewSet(AuditLogMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin,
                      viewsets.GenericViewSet):
    serializer_class = MensajeSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['emisor', 'receptor', 'leido']

    def get_queryset(self):
        user = self.request.user
        return Mensaje.objects.filter(Q(emisor=user) | Q(receptor=user)).select_related('emisor', 'receptor').order_by('-fecha')

    def perform_create(self, serializer):
        instance = serializer.save(emisor=self.request.user)
        self._write_audit('crear', instance.pk, serializer.data)

    @action(detail=True, methods=['post'])
    def marcar_leido(self, request, pk=None):
        mensaje = self.get_object()
        if mensaje.receptor_id != request.user.id:
            return Response({'success': False, 'error': 'Solo el receptor puede marcar el mensaje como leido.'}, status=403)
        mensaje.leido = True
        mensaje.save(update_fields=['leido'])
        return Response(MensajeSerializer(mensaje).data)
