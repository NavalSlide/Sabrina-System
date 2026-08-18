from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

from Sabrina_Syste.apps.academico.models import Curso, PeriodoLectivo
from Sabrina_Syste.apps.docentes.models import Docente
from Sabrina_Syste.apps.evaluaciones.models import Evaluacion
from Sabrina_Syste.apps.laboratorios.models import Laboratorio
from Sabrina_Syste.apps.reservas.models import Reserva


@require_http_methods(["GET"])
def dashboard_summary(request):
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "error": "No autenticado."}, status=401)

    user_model = get_user_model()

    stats = [
        {
            "label": "Usuarios",
            "value": user_model.objects.count(),
            "icon": "👥",
            "color": "rose",
            "trend": "+12% vs. mes anterior",
        },
        {
            "label": "Docentes",
            "value": Docente.objects.count(),
            "icon": "👩‍🏫",
            "color": "pink",
            "trend": "+3 nuevos",
        },
        {
            "label": "Cursos",
            "value": Curso.objects.count(),
            "icon": "📚",
            "color": "peach",
            "trend": "Activos hoy",
        },
        {
            "label": "Laboratorios",
            "value": Laboratorio.objects.count(),
            "icon": "🧪",
            "color": "purple",
            "trend": "Disponibles",
        },
    ]

    periodos = PeriodoLectivo.objects.order_by('-fecha_inicio')
    periodo_actual = periodos.first()

    reservas_pendientes = Reserva.objects.filter(estado='pendiente').count()
    reservas_aprobadas = Reserva.objects.filter(estado='aprobada').count()
    evaluaciones_hoy = Evaluacion.objects.filter(fecha__gte=__import__('datetime').date.today()).count()

    recent_activity = [
        {
            "id": 1,
            "title": "Periodo académico activo",
            "description": periodo_actual.nombre if periodo_actual else "Sin periodo definido",
            "time": "Hoy",
            "icon": "✨",
        },
        {
            "id": 2,
            "title": "Reservas pendientes",
            "description": f"Hay {reservas_pendientes} reservaciones por aprobar.",
            "time": "Revisión",
            "icon": "📝",
        },
        {
            "id": 3,
            "title": "Evaluaciones programadas",
            "description": f"{evaluaciones_hoy} evaluaciones vigentes para hoy.",
            "time": "Agenda",
            "icon": "📌",
        },
    ]

    next_classes = [
        {"name": "Robótica", "schedule": "Lun 09:00 - 11:00", "room": "Laboratorio 2"},
        {"name": "Matemáticas", "schedule": "Mar 10:00 - 11:30", "room": "Aula 4"},
        {"name": "Ciencias", "schedule": "Jue 08:30 - 10:00", "room": "Aula 3"},
    ]

    tasks = [
        {"title": "Revisar reservas", "due": "2 días", "done": reservas_pendientes == 0},
        {"title": "Actualizar plan de estudio", "due": "4 días", "done": False},
        {"title": "Confirmar evaluaciones", "due": "1 día", "done": evaluaciones_hoy == 0},
    ]

    response = {
        "success": True,
        "data": {
            "stats": stats,
            "summary": {
                "periodoActual": periodo_actual.nombre if periodo_actual else "Sin período",
                "reservasAprobadas": reservas_aprobadas,
                "reservasPendientes": reservas_pendientes,
                "evaluacionesHoy": evaluaciones_hoy,
            },
            "recentActivity": recent_activity,
            "nextClasses": next_classes,
            "tasks": tasks,
        },
    }
    return JsonResponse(response)
