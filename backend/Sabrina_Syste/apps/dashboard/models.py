from django.db import models
from Sabrina_Syste.apps.core.models import TimestampedModel


class IndicadorDashboardCache(TimestampedModel):
	tipo_indicador = models.CharField(max_length=150)
	periodo_lectivo = models.ForeignKey('academico.PeriodoLectivo', null=True, blank=True, on_delete=models.SET_NULL)
	datos_json = models.JSONField()
	fecha_calculo = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.tipo_indicador} - {self.periodo_lectivo}"

