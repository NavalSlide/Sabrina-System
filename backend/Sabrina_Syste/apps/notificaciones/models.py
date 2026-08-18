from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from Sabrina_Syste.apps.core.models import TimestampedModel


class Notificacion(TimestampedModel):
	TIPOS = [
		('cambio_horario', 'Cambio horario'),
		('reserva_aprobada', 'Reserva aprobada'),
		('reserva_rechazada', 'Reserva rechazada'),
		('conflicto', 'Conflicto'),
		('evaluacion_proxima', 'Evaluación próxima'),
	]
	usuario_destino = models.ForeignKey('usuarios.Usuario', on_delete=models.CASCADE, related_name='notificaciones')
	tipo = models.CharField(max_length=50, choices=TIPOS)
	titulo = models.CharField(max_length=200)
	mensaje = models.TextField()
	leida = models.BooleanField(default=False)
	fecha_creacion = models.DateTimeField(auto_now_add=True)
	# Generic relation to link to Horario/Reserva/Evaluacion
	objeto_relacionado_type = models.ForeignKey(ContentType, null=True, blank=True, on_delete=models.SET_NULL)
	objeto_relacionado_id = models.PositiveIntegerField(null=True, blank=True)
	objeto_relacionado = GenericForeignKey('objeto_relacionado_type', 'objeto_relacionado_id')


class ConfiguracionNotificacion(TimestampedModel):
	usuario = models.ForeignKey('usuarios.Usuario', on_delete=models.CASCADE, related_name='config_notificaciones')
	dias_antelacion_evaluacion = models.IntegerField(default=1)
	notificar_por_correo = models.BooleanField(default=False)

