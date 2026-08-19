from django.contrib import admin

from .models import Actividad, ConfiguracionEvaluacion, Evaluacion

admin.site.register(Actividad)
admin.site.register(Evaluacion)
admin.site.register(ConfiguracionEvaluacion)
