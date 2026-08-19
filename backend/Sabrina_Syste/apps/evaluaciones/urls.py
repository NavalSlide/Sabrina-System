from rest_framework.routers import DefaultRouter

from .views import ActividadViewSet, ConfiguracionEvaluacionViewSet, EvaluacionViewSet

router = DefaultRouter()
router.register('actividades', ActividadViewSet, basename='actividad')
router.register('evaluaciones', EvaluacionViewSet, basename='evaluacion')
router.register('configuracion', ConfiguracionEvaluacionViewSet, basename='configuracion-evaluacion')

urlpatterns = router.urls
