from rest_framework import serializers

from .models import RegistroAuditoria


class RegistroAuditoriaSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.SerializerMethodField()

    class Meta:
        model = RegistroAuditoria
        fields = ['id', 'usuario', 'usuario_nombre', 'accion', 'modulo', 'objeto_id', 'detalle', 'ip_origen', 'fecha']

    def get_usuario_nombre(self, obj):
        if not obj.usuario:
            return 'Sistema'
        return f"{obj.usuario.nombres} {obj.usuario.apellidos}".strip() or obj.usuario.email
