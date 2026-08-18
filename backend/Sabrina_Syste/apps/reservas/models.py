from django.db import models
from django.db.models import Q, UniqueConstraint
from Sabrina_Syste.apps.core.models import TimestampedModel


class RecursoReservable(TimestampedModel):
	TIPO_CHOICES = [
		('aula', 'Aula'),
		('proyector', 'Proyector'),
		('kit_robotica', 'Kit Robótica'),
	]
	tipo = models.CharField(max_length=50, choices=TIPO_CHOICES)
	nombre = models.CharField(max_length=150)
	estado = models.CharField(max_length=50, default='disponible')

	def __str__(self):
		return f"{self.nombre} ({self.tipo})"


class Reserva(TimestampedModel):
	ESTADO = [
		('pendiente', 'Pendiente'),
		('aprobada', 'Aprobada'),
		('rechazada', 'Rechazada'),
		('cancelada', 'Cancelada'),
	]
	docente = models.ForeignKey('docentes.Docente', on_delete=models.CASCADE)
	laboratorio = models.ForeignKey('laboratorios.Laboratorio', null=True, blank=True, on_delete=models.SET_NULL)
	recurso = models.ForeignKey(RecursoReservable, null=True, blank=True, on_delete=models.SET_NULL)
	fecha = models.DateField()
	bloque_horario = models.ForeignKey('horarios.BloqueHorario', on_delete=models.CASCADE)
	estado = models.CharField(max_length=20, choices=ESTADO, default='pendiente')
	motivo_rechazo = models.TextField(null=True, blank=True)
	aprobado_por = models.ForeignKey('usuarios.Usuario', null=True, blank=True, on_delete=models.SET_NULL)
	fecha_solicitud = models.DateTimeField(auto_now_add=True)
	fecha_resolucion = models.DateTimeField(null=True, blank=True)

	class Meta:
		constraints = [
			UniqueConstraint(fields=['laboratorio', 'fecha', 'bloque_horario'], condition=Q(estado='aprobada') & Q(laboratorio__isnull=False), name='unique_reserva_laboratorio_aprobada'),
			UniqueConstraint(fields=['recurso', 'fecha', 'bloque_horario'], condition=Q(estado='aprobada') & Q(recurso__isnull=False), name='unique_reserva_recurso_aprobada'),
		]

	def __str__(self):
		target = self.laboratorio or self.recurso
		return f"Reserva {target} - {self.fecha} - {self.bloque_horario} ({self.estado})"

