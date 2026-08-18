from django.db import models
from Sabrina_Syste.apps.core.models import TimestampedModel


class Actividad(TimestampedModel):
	nombre = models.CharField(max_length=200)
	fecha = models.DateField()
	descripcion = models.TextField(blank=True)

	def __str__(self):
		return f"{self.nombre} - {self.fecha}"


class Evaluacion(TimestampedModel):
	TIPO = [
		('parcial', 'Parcial'),
		('final', 'Final'),
		('quiz', 'Quiz'),
		('proyecto', 'Proyecto'),
	]
	paralelo = models.ForeignKey('academico.Paralelo', on_delete=models.CASCADE)
	materia = models.ForeignKey('academico.Materia', on_delete=models.CASCADE)
	docente = models.ForeignKey('docentes.Docente', on_delete=models.CASCADE)
	periodo_lectivo = models.ForeignKey('academico.PeriodoLectivo', on_delete=models.CASCADE)
	tipo = models.CharField(max_length=20, choices=TIPO)
	fecha = models.DateField()
	descripcion = models.TextField(blank=True)

	def clean(self):
		# Validaciones: máximo evaluaciones por día y no coincidir con Actividad
		pass


class ConfiguracionEvaluacion(TimestampedModel):
	periodo_lectivo = models.ForeignKey('academico.PeriodoLectivo', on_delete=models.CASCADE)
	max_evaluaciones_por_dia = models.IntegerField(default=1)

