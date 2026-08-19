from django.contrib import admin

from .models import EquipoLaboratorio, Laboratorio, SoftwareInstalado

admin.site.register(Laboratorio)
admin.site.register(EquipoLaboratorio)
admin.site.register(SoftwareInstalado)
