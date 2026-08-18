from django.db import models
from django.db.models import JSONField
from django.db.models import Q, UniqueConstraint
from Sabrina_Syste.apps.core.models import TimestampedModel


class BloqueHorario(TimestampedModel):
	nombre = models.CharField(max_length=150)
	hora_inicio = models.TimeField()
	hora_fin = models.TimeField()
	es_receso = models.BooleanField(default=False)
	orden = models.IntegerField(default=0)

	def __str__(self):
		return self.nombre


class Horario(TimestampedModel):
	ESTADO_CHOICES = [
		('generado_automatico', 'Generado automático'),
		('editado_manual', 'Editado manual'),
		('publicado', 'Publicado'),
	]
	paralelo = models.ForeignKey('academico.Paralelo', on_delete=models.CASCADE, related_name='horarios')
	materia = models.ForeignKey('academico.Materia', on_delete=models.CASCADE)
	docente = models.ForeignKey('docentes.Docente', on_delete=models.CASCADE)
	laboratorio = models.ForeignKey('laboratorios.Laboratorio', null=True, blank=True, on_delete=models.SET_NULL)
	bloque_horario = models.ForeignKey(BloqueHorario, on_delete=models.CASCADE)
	dia_semana = models.IntegerField()
	periodo_lectivo = models.ForeignKey('academico.PeriodoLectivo', on_delete=models.CASCADE)
	estado = models.CharField(max_length=30, choices=ESTADO_CHOICES, default='generado_automatico')
	fecha_creacion = models.DateTimeField(auto_now_add=True)
	fecha_modificacion = models.DateTimeField(auto_now=True)

	class Meta:
		constraints = [
			UniqueConstraint(fields=['docente', 'dia_semana', 'bloque_horario', 'periodo_lectivo'], name='unique_docente_bloque_periodo'),
			UniqueConstraint(fields=['laboratorio', 'dia_semana', 'bloque_horario', 'periodo_lectivo'], name='unique_laboratorio_bloque_periodo'),
			UniqueConstraint(fields=['paralelo', 'dia_semana', 'bloque_horario', 'periodo_lectivo'], name='unique_paralelo_bloque_periodo'),
		]

	def __str__(self):
		return f"{self.paralelo} | {self.materia} | {self.dia_semana} - {self.bloque_horario}"


class MateriaConsecutivaRegla(TimestampedModel):
	materia_a = models.ForeignKey('academico.Materia', on_delete=models.CASCADE, related_name='consecientes_a')
	materia_b = models.ForeignKey('academico.Materia', on_delete=models.CASCADE, related_name='consecientes_b')
	permitido = models.BooleanField(default=False)

	class Meta:
		unique_together = (('materia_a', 'materia_b'),)


class ConflictoHorario(TimestampedModel):
	TIPOS = [
		('docente', 'Docente'),
		('laboratorio', 'Laboratorio'),
		('curso', 'Curso'),
	]
	horario_generado = models.ForeignKey(Horario, null=True, blank=True, on_delete=models.SET_NULL)
	tipo_conflicto = models.CharField(max_length=20, choices=TIPOS)
	motivo = models.TextField(blank=True)
	resuelto = models.BooleanField(default=False)
	alternativa_propuesta = JSONField(null=True, blank=True)
	fecha_deteccion = models.DateTimeField(auto_now_add=True)

