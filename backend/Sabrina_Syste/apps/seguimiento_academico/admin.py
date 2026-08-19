from django.contrib import admin

from .models import Asistencia, Calificacion, Estudiante, IndicadorAcademico, Representante

admin.site.register(Estudiante)
admin.site.register(Asistencia)
admin.site.register(Calificacion)
admin.site.register(Representante)
admin.site.register(IndicadorAcademico)
