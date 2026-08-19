from rest_framework.routers import DefaultRouter

from .admin_views import PermisoViewSet, RolPermisoViewSet, RolViewSet, UsuarioAdminViewSet, UsuarioDirectoryViewSet

router = DefaultRouter()
router.register('roles', RolViewSet, basename='rol')
router.register('permisos', PermisoViewSet, basename='permiso')
router.register('roles-permisos', RolPermisoViewSet, basename='rol-permiso')
router.register('directorio', UsuarioDirectoryViewSet, basename='usuario-directorio')
router.register('', UsuarioAdminViewSet, basename='usuario-admin')

urlpatterns = router.urls
