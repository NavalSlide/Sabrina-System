from django.db import models
from Sabrina_Syste.apps.core.models import TimestampedModel


class Docente(TimestampedModel):
	usuario = models.OneToOneField('usuarios.Usuario', on_delete=models.CASCADE, related_name='docente_profile')
	especialidad = models.ForeignKey('academico.Especialidad', null=True, blank=True, on_delete=models.SET_NULL, related_name='docentes')
	horas_contratadas_semanales = models.IntegerField(default=0)
	max_horas_diarias = models.IntegerField(default=8)
	max_horas_semanales = models.IntegerField(default=40)
	max_horas_continuas = models.IntegerField(default=3)

	def __str__(self):
		return f"{self.usuario.nombres} {self.usuario.apellidos}"


class DisponibilidadDocente(TimestampedModel):
	DIA_SEMANA_CHOICES = [(i, i) for i in range(7)]
	docente = models.ForeignKey(Docente, on_delete=models.CASCADE, related_name='disponibilidades')
	dia_semana = models.IntegerField(choices=DIA_SEMANA_CHOICES)
	hora_inicio = models.TimeField()
	hora_fin = models.TimeField()
	disponible = models.BooleanField(default=True)


class DocenteLaboratorioAutorizado(TimestampedModel):
	docente = models.ForeignKey(Docente, on_delete=models.CASCADE, related_name='laboratorios_autorizados')
	laboratorio = models.ForeignKey('laboratorios.Laboratorio', on_delete=models.CASCADE, related_name='docentes_autorizados')

	class Meta:
		unique_together = (('docente', 'laboratorio'),)


class DocenteMateriaAutorizada(TimestampedModel):
	docente = models.ForeignKey(Docente, on_delete=models.CASCADE, related_name='materias_autorizadas')
	materia = models.ForeignKey('academico.Materia', on_delete=models.CASCADE, related_name='docentes_autorizados')

	class Meta:
		unique_together = (('docente', 'materia'),)


class AsignacionDocente(TimestampedModel):
	docente = models.ForeignKey(Docente, on_delete=models.CASCADE, related_name='asignaciones')
	curso = models.ForeignKey('academico.Curso', on_delete=models.CASCADE)
	paralelo = models.ForeignKey('academico.Paralelo', on_delete=models.CASCADE)
	materia = models.ForeignKey('academico.Materia', on_delete=models.CASCADE)
	periodo_lectivo = models.ForeignKey('academico.PeriodoLectivo', on_delete=models.CASCADE)
	horas_asignadas = models.IntegerField()

	class Meta:
		unique_together = (('docente', 'curso', 'paralelo', 'materia', 'periodo_lectivo'),)

