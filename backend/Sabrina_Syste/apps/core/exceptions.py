from django.db import IntegrityError
from django.http import Http404
from rest_framework import exceptions as drf_exceptions
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler


def api_exception_handler(exc, context):
    """Wraps DRF's default handler so every error response has the same
    {success, error, errors} shape the frontend's ApiResponse<T> expects,
    and turns database constraint violations (double-booked horarios,
    duplicate reservas, etc.) into a friendly 400 instead of a raw 500.
    """
    if isinstance(exc, IntegrityError) and not isinstance(exc, drf_exceptions.APIException):
        return Response(
            {
                'success': False,
                'error': 'La operacion viola una restriccion de datos (posible duplicado o conflicto de horario).',
            },
            status=400,
        )

    response = drf_exception_handler(exc, context)
    if response is None:
        return None

    if isinstance(response.data, dict) and 'detail' in response.data:
        response.data = {'success': False, 'error': str(response.data['detail'])}
    elif isinstance(response.data, (list, dict)):
        response.data = {'success': False, 'error': 'Datos invalidos.', 'errors': response.data}

    return response
