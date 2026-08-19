from django.contrib import admin

from .models import AsignacionDocente, Docente, DisponibilidadDocente, DocenteLaboratorioAutorizado, DocenteMateriaAutorizada

admin.site.register(Docente)
admin.site.register(DisponibilidadDocente)
admin.site.register(DocenteLaboratorioAutorizado)
admin.site.register(DocenteMateriaAutorizada)
admin.site.register(AsignacionDocente)
