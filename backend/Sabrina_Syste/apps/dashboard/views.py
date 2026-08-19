import datetime

from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

from Sabrina_Syste.apps.academico.models import Curso, Paralelo, PeriodoLectivo, PlanEstudio
from Sabrina_Syste.apps.docentes.models import Docente
from Sabrina_Syste.apps.evaluaciones.models import Evaluacion
from Sabrina_Syste.apps.horarios.models import Horario
from Sabrina_Syste.apps.laboratorios.models import Laboratorio
from Sabrina_Syste.apps.reservas.models import Reserva

DIAS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']


@require_http_methods(["GET"])
def dashboard_summary(request):
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "error": "No autenticado."}, status=401)

    user_model = get_user_model()

    periodo_actual = PeriodoLectivo.objects.filter(activo=True).order_by('-fecha_inicio').first()
    if periodo_actual is None:
        periodo_actual = PeriodoLectivo.objects.order_by('-fecha_inicio').first()

    docentes_con_asignacion = Docente.objects.filter(asignaciones__isnull=False).distinct().count()
    paralelos_abiertos = Paralelo.objects.filter(periodo_lectivo=periodo_actual).count() if periodo_actual else 0
    labs_disponibles = Laboratorio.objects.filter(estado='disponible').count()

    stats = [
        {
            "label": "Usuarios",
            "value": user_model.objects.count(),
            "icon": "user-circle",
            "color": "rose",
            "trend": "Total registrados",
        },
        {
            "label": "Docentes",
            "value": Docente.objects.count(),
            "icon": "users",
            "color": "pink",
            "trend": f"{docentes_con_asignacion} con asignacion activa",
        },
        {
            "label": "Cursos",
            "value": Curso.objects.count(),
            "icon": "book-open",
            "color": "peach",
            "trend": f"{paralelos_abiertos} paralelos en el periodo actual",
        },
        {
            "label": "Laboratorios",
            "value": Laboratorio.objects.count(),
            "icon": "flask",
            "color": "purple",
            "trend": f"{labs_disponibles} disponibles ahora",
        },
    ]

    reservas_pendientes = Reserva.objects.filter(estado='pendiente').count()
    reservas_aprobadas = Reserva.objects.filter(estado='aprobada').count()
    evaluaciones_hoy = Evaluacion.objects.filter(fecha=datetime.date.today()).count()

    recent_activity = [
        {
            "id": 1,
            "title": "Periodo académico activo",
            "description": periodo_actual.nombre if periodo_actual else "Sin periodo definido",
            "time": "Hoy",
            "icon": "calendar",
        },
        {
            "id": 2,
            "title": "Reservas pendientes",
            "description": f"Hay {reservas_pendientes} reservaciones por aprobar.",
            "time": "Revisión",
            "icon": "clipboard-list",
        },
        {
            "id": 3,
            "title": "Evaluaciones programadas",
            "description": f"{evaluaciones_hoy} evaluaciones vigentes para hoy.",
            "time": "Agenda",
            "icon": "flag",
        },
    ]

    next_classes = []
    if periodo_actual:
        hoy = datetime.date.today().weekday()
        horarios_qs = (
            Horario.objects.select_related('materia', 'bloque_horario', 'laboratorio', 'paralelo')
            .filter(periodo_lectivo=periodo_actual, dia_semana__gte=hoy)
            .order_by('dia_semana', 'bloque_horario__orden')[:3]
        )
        for horario in horarios_qs:
            lugar = horario.laboratorio.nombre if horario.laboratorio else f"Paralelo {horario.paralelo.nombre}"
            next_classes.append({
                "name": horario.materia.nombre,
                "schedule": f"{DIAS[horario.dia_semana]} {horario.bloque_horario.hora_inicio.strftime('%H:%M')} - {horario.bloque_horario.hora_fin.strftime('%H:%M')}",
                "room": lugar,
            })

    plan_estudio_ok = PlanEstudio.objects.filter(periodo_lectivo=periodo_actual).exists() if periodo_actual else False
    tasks = [
        {"title": "Revisar reservas pendientes", "due": "Cuando haya solicitudes", "done": reservas_pendientes == 0},
        {"title": "Definir plan de estudio del periodo", "due": "Antes de iniciar clases", "done": plan_estudio_ok},
        {"title": "Confirmar evaluaciones del dia", "due": "Hoy", "done": evaluaciones_hoy == 0},
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
