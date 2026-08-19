from rest_framework import serializers

from .models import ConfiguracionNotificacion, Mensaje, Notificacion


class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = ['id', 'usuario_destino', 'tipo', 'titulo', 'mensaje', 'leida', 'fecha_creacion']
        read_only_fields = ['usuario_destino', 'fecha_creacion']


class ConfiguracionNotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionNotificacion
        fields = ['id', 'usuario', 'dias_antelacion_evaluacion', 'notificar_por_correo']
        read_only_fields = ['usuario']


class MensajeSerializer(serializers.ModelSerializer):
    emisor_nombre = serializers.SerializerMethodField()
    receptor_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Mensaje
        fields = ['id', 'emisor', 'emisor_nombre', 'receptor', 'receptor_nombre', 'mensaje', 'fecha', 'leido']
        read_only_fields = ['emisor', 'fecha', 'leido']

    def get_emisor_nombre(self, obj):
        return f"{obj.emisor.nombres} {obj.emisor.apellidos}".strip() or obj.emisor.email

    def get_receptor_nombre(self, obj):
        return f"{obj.receptor.nombres} {obj.receptor.apellidos}".strip() or obj.receptor.email
