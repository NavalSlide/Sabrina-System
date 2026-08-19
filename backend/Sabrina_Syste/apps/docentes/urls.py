from rest_framework.routers import DefaultRouter

from .views import (
    AsignacionDocenteViewSet,
    DisponibilidadDocenteViewSet,
    DocenteLaboratorioAutorizadoViewSet,
    DocenteMateriaAutorizadaViewSet,
    DocenteViewSet,
)

router = DefaultRouter()
router.register('docentes', DocenteViewSet, basename='docente')
router.register('disponibilidad', DisponibilidadDocenteViewSet, basename='disponibilidad-docente')
router.register('materias-autorizadas', DocenteMateriaAutorizadaViewSet, basename='docente-materia')
router.register('laboratorios-autorizados', DocenteLaboratorioAutorizadoViewSet, basename='docente-laboratorio')
router.register('asignaciones', AsignacionDocenteViewSet, basename='asignacion-docente')

urlpatterns = router.urls
