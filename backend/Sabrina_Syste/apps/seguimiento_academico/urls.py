from rest_framework.routers import DefaultRouter

from .views import AsistenciaViewSet, CalificacionViewSet, EstudianteViewSet, IndicadorAcademicoViewSet, RepresentanteViewSet

router = DefaultRouter()
router.register('estudiantes', EstudianteViewSet, basename='estudiante')
router.register('asistencias', AsistenciaViewSet, basename='asistencia')
router.register('calificaciones', CalificacionViewSet, basename='calificacion')
router.register('representantes', RepresentanteViewSet, basename='representante')
router.register('indicadores', IndicadorAcademicoViewSet, basename='indicador-academico')

urlpatterns = router.urls
