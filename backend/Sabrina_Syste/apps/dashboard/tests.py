import json

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from Sabrina_Syste.apps.academico.models import Curso, PeriodoLectivo
from Sabrina_Syste.apps.docentes.models import Docente
from Sabrina_Syste.apps.evaluaciones.models import Evaluacion
from Sabrina_Syste.apps.laboratorios.models import Laboratorio
from Sabrina_Syste.apps.reservas.models import Reserva
from Sabrina_Syste.apps.usuarios.models import Usuario


class DashboardSummaryTests(TestCase):
    def test_dashboard_summary_returns_real_counts(self):
        user = get_user_model().objects.create_user(email='admin@sabrina.test', password='secret123')

        PeriodoLectivo.objects.create(nombre='2025-2026', fecha_inicio='2025-09-01', fecha_fin='2026-06-30', activo=True, estado='activo')
        Curso.objects.create(nombre='Bachillerato', nivel='Secundaria', especialidad=None)
        Laboratorio.objects.create(nombre='Lab de Robótica', capacidad=24, estado='disponible', ubicacion='Piso 2')

        self.client.force_login(user)
        response = self.client.get(reverse('dashboard_summary'))

        self.assertEqual(response.status_code, 200)
        payload = json.loads(response.content)
        self.assertTrue(payload['success'])
        self.assertEqual(payload['data']['stats'][0]['value'], 1)
        self.assertEqual(payload['data']['stats'][1]['value'], 0)
        self.assertEqual(payload['data']['stats'][2]['value'], 1)
