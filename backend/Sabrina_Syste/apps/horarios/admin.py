from django.contrib import admin

from .models import BloqueHorario, ConflictoHorario, Horario, MateriaConsecutivaRegla

admin.site.register(BloqueHorario)
admin.site.register(Horario)
admin.site.register(MateriaConsecutivaRegla)
admin.site.register(ConflictoHorario)
