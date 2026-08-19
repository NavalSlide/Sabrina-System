import json
import re
import secrets
from datetime import timedelta

from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_http_methods

from .models import Rol, TokenRecuperacion, Usuario

EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
NAME_REGEX = re.compile(r"^[A-Za-zÀ-ÿ\s'\-]+$")
PASSWORD_REGEX = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$")


def _validate_name(value, field_name):
    text = (value or '').strip()
    if len(text) < 2 or len(text) > 60:
        raise ValidationError(f"{field_name} debe tener entre 2 y 60 caracteres.")
    if not NAME_REGEX.fullmatch(text):
        raise ValidationError(f"{field_name} solo puede contener letras, espacios y algunos caracteres especiales.")
    return text


def _validate_email(value):
    email = (value or '').strip().lower()
    try:
        validate_email(email)
    except ValidationError:
        raise ValidationError("Ingresa un email válido.")
    if not EMAIL_REGEX.fullmatch(email):
        raise ValidationError("Ingresa un email válido.")
    if len(email) > 254:
        raise ValidationError("El email es demasiado largo.")
    return email


def _validate_password(value):
    password = value or ''
    if len(password) < 8 or len(password) > 128:
        raise ValidationError("La contraseña debe tener entre 8 y 128 caracteres.")
    if not PASSWORD_REGEX.fullmatch(password):
        raise ValidationError("La contraseña debe incluir mayúsculas, minúsculas, número y símbolo.")
    return password


def _serialize_user(user):
    rol_nombre = user.rol.nombre if user.rol else None
    return {
        "id": str(user.id),
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "full_name": user.get_full_name(),
        "rol": rol_nombre,
        "is_admin": bool(user.is_superuser or user.is_staff or rol_nombre == 'Administrador'),
    }


@ensure_csrf_cookie
@csrf_exempt
@require_http_methods(["POST"])
def register_view(request):
    try:
        data = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "error": "JSON inválido."}, status=400)

    if not isinstance(data, dict):
        return JsonResponse({"success": False, "error": "Formato de datos no válido."}, status=400)

    try:
        first_name = _validate_name(data.get('first_name'), 'Nombre')
        last_name = _validate_name(data.get('last_name'), 'Apellido')
        email = _validate_email(data.get('email'))
        password = _validate_password(data.get('password'))
    except ValidationError as exc:
        return JsonResponse({"success": False, "error": str(exc)}, status=400)

    if Usuario.objects.filter(email=email).exists():
        return JsonResponse({"success": False, "error": "Ya existe un usuario con ese email."}, status=400)

    user = Usuario.objects.create_user(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        nombres=first_name,
        apellidos=last_name,
        rol=Rol.objects.filter(nombre='Estudiante').first(),
    )

    login(request, user)

    return JsonResponse({
        "success": True,
        "message": "Usuario registrado correctamente.",
        "data": {"user": _serialize_user(user)},
    }, status=201)


@ensure_csrf_cookie
@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    try:
        data = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "error": "JSON inválido."}, status=400)

    if not isinstance(data, dict):
        return JsonResponse({"success": False, "error": "Formato de datos no válido."}, status=400)

    try:
        email = _validate_email(data.get('email'))
    except ValidationError as exc:
        return JsonResponse({"success": False, "error": str(exc)}, status=400)

    password = data.get('password') or ''
    if len(password) < 8 or len(password) > 128:
        return JsonResponse({"success": False, "error": "La contraseña debe tener entre 8 y 128 caracteres."}, status=400)

    user = Usuario.objects.filter(email=email).first()
    if user is None or not user.is_active:
        return JsonResponse({"success": False, "error": "Credenciales incorrectas."}, status=401)

    auth_user = authenticate(request, username=email, password=password)
    if auth_user is None:
        return JsonResponse({"success": False, "error": "Credenciales incorrectas."}, status=401)

    login(request, auth_user)

    return JsonResponse({
        "success": True,
        "message": "Sesión iniciada correctamente.",
        "data": {"user": _serialize_user(auth_user)},
    })


@csrf_exempt
@require_http_methods(["POST"])
def logout_view(request):
    logout(request)
    return JsonResponse({"success": True, "message": "Sesión cerrada."})


@ensure_csrf_cookie
@require_http_methods(["GET"])
def me_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "error": "No autenticado."}, status=401)

    user = request.user
    return JsonResponse({
        "success": True,
        "data": {"user": _serialize_user(user)},
    })


@csrf_exempt
@require_http_methods(["POST"])
def password_reset_request_view(request):
    try:
        data = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "error": "JSON inválido."}, status=400)

    email = (data.get('email') or '').strip().lower()
    generic_response = JsonResponse({
        "success": True,
        "message": "Si el correo existe en nuestro sistema, enviamos un enlace de recuperación.",
    })

    try:
        _validate_email(email)
    except ValidationError:
        return generic_response

    user = Usuario.objects.filter(email=email, is_active=True).first()
    if user is None:
        return generic_response

    token = secrets.token_urlsafe(32)
    TokenRecuperacion.objects.create(
        usuario=user,
        token=token,
        fecha_expiracion=timezone.now() + timedelta(hours=1),
    )

    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
    reset_link = f"{frontend_url}/recuperar-contrasena/confirmar?token={token}"
    send_mail(
        subject='Recupera tu contraseña - Sabrina',
        message=(
            f"Hola {user.nombres or user.email},\n\n"
            f"Recibimos una solicitud para restablecer tu contraseña. Este enlace es valido por 1 hora:\n"
            f"{reset_link}\n\n"
            "Si no solicitaste esto, puedes ignorar este correo."
        ),
        from_email=None,
        recipient_list=[user.email],
        fail_silently=True,
    )

    return generic_response


@csrf_exempt
@require_http_methods(["POST"])
def password_reset_confirm_view(request):
    try:
        data = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "error": "JSON inválido."}, status=400)

    token = (data.get('token') or '').strip()
    if not token:
        return JsonResponse({"success": False, "error": "Token invalido o vencido."}, status=400)

    try:
        password = _validate_password(data.get('password'))
    except ValidationError as exc:
        return JsonResponse({"success": False, "error": str(exc)}, status=400)

    token_obj = TokenRecuperacion.objects.filter(token=token, usado=False).select_related('usuario').first()
    if token_obj is None or token_obj.fecha_expiracion < timezone.now():
        return JsonResponse({"success": False, "error": "Token invalido o vencido."}, status=400)

    user = token_obj.usuario
    user.set_password(password)
    user.save(update_fields=['password'])
    token_obj.usado = True
    token_obj.save(update_fields=['usado'])

    return JsonResponse({"success": True, "message": "Contraseña actualizada correctamente."})
