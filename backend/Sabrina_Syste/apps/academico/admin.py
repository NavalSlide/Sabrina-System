from django.contrib import admin

from .models import Curso, Especialidad, Jornada, Materia, Paralelo, PeriodoLectivo, PlanEstudio

admin.site.register(Especialidad)
admin.site.register(Jornada)
admin.site.register(PeriodoLectivo)
admin.site.register(Curso)
admin.site.register(Materia)
admin.site.register(Paralelo)
admin.site.register(PlanEstudio)
