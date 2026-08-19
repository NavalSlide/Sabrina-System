from django.db import models
from Sabrina_Syste.apps.core.models import TimestampedModel


class PeriodoLectivo(TimestampedModel):
	ESTADO_CHOICES = [
		('planificado', 'Planificado'),
		('activo', 'Activo'),
		('cerrado', 'Cerrado'),
	]
	nombre = models.CharField(max_length=100)
	fecha_inicio = models.DateField()
	fecha_fin = models.DateField()
	activo = models.BooleanField(default=False)
	estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='planificado')

	def __str__(self):
		return self.nombre


class Jornada(TimestampedModel):
	nombre = models.CharField(max_length=50)
	hora_inicio = models.TimeField()
	hora_fin = models.TimeField()

	def __str__(self):
		return self.nombre


class Especialidad(TimestampedModel):
	nombre = models.CharField(max_length=150)
	descripcion = models.TextField(blank=True)

	def __str__(self):
		return self.nombre


class Curso(TimestampedModel):
	nombre = models.CharField(max_length=150)
	nivel = models.CharField(max_length=50)
	especialidad = models.ForeignKey(Especialidad, null=True, blank=True, on_delete=models.SET_NULL, related_name='cursos')

	def __str__(self):
		return self.nombre


class Paralelo(TimestampedModel):
	curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='paralelos')
	jornada = models.ForeignKey(Jornada, on_delete=models.PROTECT, related_name='paralelos')
	nombre = models.CharField(max_length=5)
	periodo_lectivo = models.ForeignKey(PeriodoLectivo, on_delete=models.CASCADE, related_name='paralelos')
	capacidad_maxima = models.IntegerField()

	class Meta:
		unique_together = (('curso', 'jornada', 'nombre', 'periodo_lectivo'),)

	def __str__(self):
		return f"{self.curso.nombre} - {self.nombre} ({self.periodo_lectivo.nombre})"


class Materia(TimestampedModel):
	nombre = models.CharField(max_length=150)
	descripcion = models.TextField(blank=True)
	creditos = models.IntegerField(default=1)

	def __str__(self):
		return self.nombre


class PlanEstudio(TimestampedModel):
	especialidad = models.ForeignKey(Especialidad, on_delete=models.CASCADE, related_name='planes')
	curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='planes')
	materia = models.ForeignKey(Materia, on_delete=models.CASCADE, related_name='planes')
	periodo_lectivo = models.ForeignKey(PeriodoLectivo, on_delete=models.CASCADE, related_name='planes')
	horas_semanales = models.IntegerField()

	class Meta:
		unique_together = (('especialidad', 'curso', 'materia', 'periodo_lectivo'),)

