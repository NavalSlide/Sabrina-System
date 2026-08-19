from rest_framework.routers import DefaultRouter

from .views import RecursoReservableViewSet, ReservaViewSet

router = DefaultRouter()
router.register('recursos', RecursoReservableViewSet, basename='recurso-reservable')
router.register('reservas', ReservaViewSet, basename='reserva')

urlpatterns = router.urls
