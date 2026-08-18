from django.db import models
from Sabrina_Syste.apps.core.models import TimestampedModel


class Laboratorio(TimestampedModel):
	ESTADO_CHOICES = [
		('disponible', 'Disponible'),
		('mantenimiento', 'Mantenimiento'),
		('inhabilitado', 'Inhabilitado'),
	]
	nombre = models.CharField(max_length=150)
	capacidad = models.IntegerField(default=0)
	estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='disponible')
	ubicacion = models.CharField(max_length=255, blank=True)

	def __str__(self):
		return self.nombre


class EquipoLaboratorio(TimestampedModel):
	laboratorio = models.ForeignKey(Laboratorio, on_delete=models.CASCADE, related_name='equipos')
	nombre = models.CharField(max_length=150)
	cantidad = models.IntegerField(default=1)
	estado = models.CharField(max_length=50, default='operativo')


class SoftwareInstalado(TimestampedModel):
	laboratorio = models.ForeignKey(Laboratorio, on_delete=models.CASCADE, related_name='softwares')
	nombre = models.CharField(max_length=150)
	version = models.CharField(max_length=50, blank=True)

