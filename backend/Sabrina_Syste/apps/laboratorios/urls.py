from rest_framework.routers import DefaultRouter

from .views import EquipoLaboratorioViewSet, LaboratorioViewSet, SoftwareInstaladoViewSet

router = DefaultRouter()
router.register('laboratorios', LaboratorioViewSet, basename='laboratorio')
router.register('equipos', EquipoLaboratorioViewSet, basename='equipo-laboratorio')
router.register('softwares', SoftwareInstaladoViewSet, basename='software-instalado')

urlpatterns = router.urls
