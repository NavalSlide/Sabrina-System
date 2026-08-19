from rest_framework.routers import DefaultRouter

from .views import ConfiguracionNotificacionViewSet, MensajeViewSet, NotificacionViewSet

router = DefaultRouter()
router.register('notificaciones', NotificacionViewSet, basename='notificacion')
router.register('configuracion', ConfiguracionNotificacionViewSet, basename='configuracion-notificacion')
router.register('mensajes', MensajeViewSet, basename='mensaje')

urlpatterns = router.urls
