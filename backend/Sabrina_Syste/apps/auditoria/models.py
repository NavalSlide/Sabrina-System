from django.db import models
from Sabrina_Syste.apps.core.models import TimestampedModel


class RegistroAuditoria(models.Model):
	ACCIONES = [
		('crear', 'Crear'),
		('editar', 'Editar'),
		('eliminar', 'Eliminar'),
	]
	usuario = models.ForeignKey('usuarios.Usuario', null=True, blank=True, on_delete=models.SET_NULL)
	accion = models.CharField(max_length=20, choices=ACCIONES)
	modulo = models.CharField(max_length=150)
	objeto_id = models.BigIntegerField()
	detalle = models.JSONField()
	ip_origen = models.GenericIPAddressField(null=True, blank=True)
	fecha = models.DateTimeField(auto_now_add=True)

	class Meta:
		verbose_name = 'Registro Auditoría'
		verbose_name_plural = 'Registros Auditoría'


class RespaldoSistema(TimestampedModel):
	TIPOS = [
		('manual', 'Manual'),
		('automatico', 'Automático'),
	]
	nombre_archivo = models.CharField(max_length=255)
	ruta_archivo = models.CharField(max_length=500)
	tipo = models.CharField(max_length=20, choices=TIPOS)
	tamano_mb = models.DecimalField(max_digits=10, decimal_places=2)
	generado_por = models.ForeignKey('usuarios.Usuario', null=True, blank=True, on_delete=models.SET_NULL)
	fecha_generacion = models.DateTimeField(auto_now_add=True)

