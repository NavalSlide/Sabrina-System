from rest_framework.routers import DefaultRouter

from .views import BloqueHorarioViewSet, ConflictoHorarioViewSet, HorarioViewSet, MateriaConsecutivaReglaViewSet

router = DefaultRouter()
router.register('bloques', BloqueHorarioViewSet, basename='bloque-horario')
router.register('horarios', HorarioViewSet, basename='horario')
router.register('reglas-consecutivas', MateriaConsecutivaReglaViewSet, basename='materia-consecutiva-regla')
router.register('conflictos', ConflictoHorarioViewSet, basename='conflicto-horario')

urlpatterns = router.urls
