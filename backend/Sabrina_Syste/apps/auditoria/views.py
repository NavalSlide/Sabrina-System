from rest_framework import viewsets

from Sabrina_Syste.apps.core.permissions import IsAdmin

from .models import RegistroAuditoria
from .serializers import RegistroAuditoriaSerializer


class RegistroAuditoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RegistroAuditoria.objects.select_related('usuario').all().order_by('-fecha')
    serializer_class = RegistroAuditoriaSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['usuario', 'accion', 'modulo']
    search_fields = ['modulo', 'accion']
