"""
URL configuration for Sabrina_Syste project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
"""
from django.contrib import admin
from django.urls import include, path
from Sabrina_Syste.apps.dashboard.urls import urlpatterns as dashboard_urls
from Sabrina_Syste.apps.seguimiento_academico import views as seguimiento_views

urlpatterns = [
    path('', seguimiento_views.landing, name='landing'),
    path('admin/', admin.site.urls),

    # Auth (login/register/logout/me) - unchanged, function-based views.
    path('api/', include('Sabrina_Syste.apps.usuarios.urls')),

    # Dashboard summary.
    path('api/dashboard/', include(dashboard_urls)),

    # Per-module REST APIs (DRF ModelViewSets).
    path('api/usuarios/', include('Sabrina_Syste.apps.usuarios.urls_admin')),
    path('api/academico/', include('Sabrina_Syste.apps.academico.urls')),
    path('api/docentes/', include('Sabrina_Syste.apps.docentes.urls')),
    path('api/horarios/', include('Sabrina_Syste.apps.horarios.urls')),
    path('api/estudiantes/', include('Sabrina_Syste.apps.seguimiento_academico.urls')),
    path('api/laboratorios/', include('Sabrina_Syste.apps.laboratorios.urls')),
    path('api/reservas/', include('Sabrina_Syste.apps.reservas.urls')),
    path('api/evaluaciones/', include('Sabrina_Syste.apps.evaluaciones.urls')),
    path('api/notificaciones/', include('Sabrina_Syste.apps.notificaciones.urls')),
    path('api/auditoria/', include('Sabrina_Syste.apps.auditoria.urls')),
]
