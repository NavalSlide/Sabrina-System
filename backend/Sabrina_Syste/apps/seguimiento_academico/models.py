from django.db import models
from decimal import Decimal
from Sabrina_Syste.apps.core.models import TimestampedModel


class Estudiante(TimestampedModel):
	ESTADO_CHOICES = [
		('activo', 'Activo'),
		('inactivo', 'Inactivo'),
		('graduado', 'Graduado'),
		('retirado', 'Retirado'),
	]
	usuario = models.OneToOneField('usuarios.Usuario', on_delete=models.CASCADE, related_name='estudiante_profile')
	paralelo = models.ForeignKey('academico.Paralelo', null=True, blank=True, on_delete=models.SET_NULL, related_name='estudiantes')
	fecha_nacimiento = models.DateField(null=True, blank=True)
	fecha_ingreso = models.DateField(null=True, blank=True)
	estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='activo')

	@property
	def curso(self):
		return self.paralelo.curso if self.paralelo else None

	def __str__(self):
		return f"{self.usuario.nombres} {self.usuario.apellidos}"


class Calificacion(TimestampedModel):
	estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE, related_name='calificaciones')
	materia = models.ForeignKey('academico.Materia', on_delete=models.CASCADE)
	paralelo = models.ForeignKey('academico.Paralelo', on_delete=models.CASCADE)
	periodo_lectivo = models.ForeignKey('academico.PeriodoLectivo', on_delete=models.CASCADE)
	docente = models.ForeignKey('docentes.Docente', on_delete=models.CASCADE)
	nota = models.DecimalField(max_digits=5, decimal_places=2)
	tipo_evaluacion = models.ForeignKey('evaluaciones.Evaluacion', null=True, blank=True, on_delete=models.SET_NULL)
	fecha_registro = models.DateTimeField(auto_now_add=True)


class Asistencia(TimestampedModel):
	ESTADO = [
		('presente', 'Presente'),
		('ausente', 'Ausente'),
		('atraso', 'Atraso'),
		('justificado', 'Justificado'),
	]
	estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE, related_name='asistencias')
	paralelo = models.ForeignKey('academico.Paralelo', on_delete=models.CASCADE)
	fecha = models.DateField()
	estado = models.CharField(max_length=20, choices=ESTADO)
	registrado_por = models.ForeignKey('docentes.Docente', on_delete=models.CASCADE)

	class Meta:
		unique_together = (('estudiante', 'paralelo', 'fecha'),)


class Representante(TimestampedModel):
	usuario = models.OneToOneField('usuarios.Usuario', on_delete=models.CASCADE, related_name='representante_profile')
	estudiantes = models.ManyToManyField(Estudiante, related_name='representantes')
	parentesco = models.CharField(max_length=100, blank=True)


class IndicadorAcademico(TimestampedModel):
	paralelo = models.ForeignKey('academico.Paralelo', null=True, blank=True, on_delete=models.SET_NULL)
	docente = models.ForeignKey('docentes.Docente', null=True, blank=True, on_delete=models.SET_NULL)
	materia = models.ForeignKey('academico.Materia', null=True, blank=True, on_delete=models.SET_NULL)
	periodo_lectivo = models.ForeignKey('academico.PeriodoLectivo', on_delete=models.CASCADE)
	promedio = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))
	indice_reprobacion = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))
	indice_asistencia = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))
	fecha_calculo = models.DateTimeField(auto_now_add=True)

