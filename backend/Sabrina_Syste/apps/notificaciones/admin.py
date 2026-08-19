from django.contrib import admin

from .models import ConfiguracionNotificacion, Mensaje, Notificacion

admin.site.register(Notificacion)
admin.site.register(ConfiguracionNotificacion)
admin.site.register(Mensaje)
