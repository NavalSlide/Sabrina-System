import json
import re

from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Usuario

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
    )

    login(request, user)

    return JsonResponse({
        "success": True,
        "message": "Usuario registrado correctamente.",
        "data": {
            "user": {
                "id": str(user.id),
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "full_name": user.get_full_name(),
            }
        },
    }, status=201)


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
        "data": {
            "user": {
                "id": str(auth_user.id),
                "email": auth_user.email,
                "first_name": auth_user.first_name,
                "last_name": auth_user.last_name,
                "full_name": auth_user.get_full_name(),
            }
        },
    })


@csrf_exempt
@require_http_methods(["POST"])
def logout_view(request):
    logout(request)
    return JsonResponse({"success": True, "message": "Sesión cerrada."})


@require_http_methods(["GET"])
def me_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "error": "No autenticado."}, status=401)

    user = request.user
    return JsonResponse({
        "success": True,
        "data": {
            "user": {
                "id": str(user.id),
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "full_name": user.get_full_name(),
            }
        },
    })
