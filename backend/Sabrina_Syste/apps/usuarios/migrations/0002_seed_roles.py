from django.db import migrations

ROLES_BASE = [
    ('Administrador', 'Acceso total al sistema: usuarios, roles, configuracion academica y auditoria.'),
    ('Docente', 'Gestiona sus asignaciones, horarios, asistencia, calificaciones y reservas de laboratorio.'),
    ('Estudiante', 'Consulta su horario, asistencia, calificaciones y notificaciones.'),
    ('Representante', 'Consulta la informacion academica de sus representados.'),
]


def seed_roles(apps, schema_editor):
    Rol = apps.get_model('usuarios', 'Rol')
    for nombre, descripcion in ROLES_BASE:
        Rol.objects.get_or_create(nombre=nombre, defaults={'descripcion': descripcion})


def remove_roles(apps, schema_editor):
    Rol = apps.get_model('usuarios', 'Rol')
    Rol.objects.filter(nombre__in=[nombre for nombre, _ in ROLES_BASE]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_roles, remove_roles),
    ]
