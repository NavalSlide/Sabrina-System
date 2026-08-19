from rest_framework import viewsets

from Sabrina_Syste.apps.core.mixins import AuditLogMixin
from Sabrina_Syste.apps.core.permissions import IsAdminOrReadOnly

from .models import EquipoLaboratorio, Laboratorio, SoftwareInstalado
from .serializers import EquipoLaboratorioSerializer, LaboratorioSerializer, SoftwareInstaladoSerializer


class LaboratorioViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = Laboratorio.objects.prefetch_related('equipos', 'softwares').all().order_by('nombre')
    serializer_class = LaboratorioSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['estado']
    search_fields = ['nombre', 'ubicacion']


class EquipoLaboratorioViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = EquipoLaboratorio.objects.select_related('laboratorio').all()
    serializer_class = EquipoLaboratorioSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['laboratorio', 'estado']


class SoftwareInstaladoViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = SoftwareInstalado.objects.select_related('laboratorio').all()
    serializer_class = SoftwareInstaladoSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['laboratorio']
