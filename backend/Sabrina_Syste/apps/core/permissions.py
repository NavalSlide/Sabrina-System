from rest_framework.permissions import SAFE_METHODS, BasePermission


def role_name(user):
    """Returns the user's Rol.nombre, or None if unauthenticated/unassigned."""
    if not user or not getattr(user, 'is_authenticated', False):
        return None
    rol = getattr(user, 'rol', None)
    return rol.nombre if rol else None


def is_admin(user):
    return bool(user and user.is_authenticated and (user.is_superuser or user.is_staff or role_name(user) == 'Administrador'))


def is_docente(user):
    return role_name(user) == 'Docente'


class IsAdmin(BasePermission):
    """Only Administradores (or Django staff/superusers) may access."""

    def has_permission(self, request, view):
        return is_admin(request.user)


class IsAdminOrReadOnly(BasePermission):
    """Any authenticated user can read; only Administradores can write."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        return is_admin(request.user)


class IsDocenteOrAdminOrReadOnly(BasePermission):
    """Any authenticated user can read; Docentes and Administradores can write."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        return is_admin(request.user) or is_docente(request.user)
