import json

from django.core.serializers.json import DjangoJSONEncoder


def get_client_ip(request):
    forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if forwarded:
        return forwarded.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


def _json_safe(data):
    """Round-trips serializer.data through DjangoJSONEncoder so Decimal/date/UUID
    values survive being stored in the plain (unencoded) auditoria.RegistroAuditoria.detalle JSONField."""
    return json.loads(json.dumps(data, cls=DjangoJSONEncoder))


class AuditLogMixin:
    """Drop into a ModelViewSet to automatically log create/update/destroy into
    auditoria.RegistroAuditoria. `audit_module` lets a viewset override the
    default app_label.model_name label."""

    audit_module = None

    def _audit_module_label(self):
        if self.audit_module:
            return self.audit_module
        # Prefer the serializer's model - works for viewsets that only
        # implement get_queryset() (no class-level `queryset` attribute).
        model = self.get_serializer_class().Meta.model
        return f"{model._meta.app_label}.{model._meta.model_name}"

    def _write_audit(self, accion, objeto_id, detalle):
        from Sabrina_Syste.apps.auditoria.models import RegistroAuditoria

        user = self.request.user if getattr(self.request.user, 'is_authenticated', False) else None
        RegistroAuditoria.objects.create(
            usuario=user,
            accion=accion,
            modulo=self._audit_module_label(),
            objeto_id=objeto_id or 0,
            detalle=_json_safe(detalle),
            ip_origen=get_client_ip(self.request),
        )

    def perform_create(self, serializer):
        super().perform_create(serializer)
        self._write_audit('crear', serializer.instance.pk, serializer.data)

    def perform_update(self, serializer):
        super().perform_update(serializer)
        self._write_audit('editar', serializer.instance.pk, serializer.data)

    def perform_destroy(self, instance):
        object_id = instance.pk
        super().perform_destroy(instance)
        self._write_audit('eliminar', object_id, {'id': object_id})
