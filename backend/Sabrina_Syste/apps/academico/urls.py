from rest_framework.routers import DefaultRouter

from .views import (
    CursoViewSet,
    EspecialidadViewSet,
    JornadaViewSet,
    MateriaViewSet,
    ParaleloViewSet,
    PeriodoLectivoViewSet,
    PlanEstudioViewSet,
)

router = DefaultRouter()
router.register('especialidades', EspecialidadViewSet, basename='especialidad')
router.register('jornadas', JornadaViewSet, basename='jornada')
router.register('periodos', PeriodoLectivoViewSet, basename='periodo-lectivo')
router.register('cursos', CursoViewSet, basename='curso')
router.register('materias', MateriaViewSet, basename='materia')
router.register('paralelos', ParaleloViewSet, basename='paralelo')
router.register('plan-estudio', PlanEstudioViewSet, basename='plan-estudio')

urlpatterns = router.urls
