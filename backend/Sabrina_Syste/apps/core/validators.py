from rest_framework import serializers


def require_docente_or_auto_fill(field_name, attrs, instance, context):
    """For serializers where `field_name` (an FK to docentes.Docente) is
    optional so a logged-in docente can leave it blank and have the view
    auto-fill it from their own profile - anyone WITHOUT a docente profile
    (e.g. an admin) must pick one explicitly, or they'd hit a raw NOT NULL
    IntegrityError with no useful message."""
    if field_name in attrs:
        return
    if instance is not None and getattr(instance, f'{field_name}_id', None):
        return
    request = context.get('request')
    if request and hasattr(request.user, 'docente_profile'):
        return
    raise serializers.ValidationError({
        field_name: 'Selecciona un docente (tu cuenta no tiene un perfil de docente para completarlo automaticamente).',
    })
