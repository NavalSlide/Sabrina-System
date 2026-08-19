from rest_framework import serializers

from Sabrina_Syste.apps.core.validators import require_docente_or_auto_fill
from Sabrina_Syste.apps.docentes.models import Docente

from .models import RecursoReservable, Reserva


class RecursoReservableSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecursoReservable
        fields = ['id', 'tipo', 'nombre', 'estado']


class ReservaSerializer(serializers.ModelSerializer):
    docente_nombre = serializers.SerializerMethodField()
    # Optional on input: the view fills it in from request.user's docente
    # profile when omitted, so a docente doesn't have to pick themselves.
    docente = serializers.PrimaryKeyRelatedField(queryset=Docente.objects.all(), required=False)
    laboratorio_nombre = serializers.CharField(source='laboratorio.nombre', read_only=True, default=None)
    recurso_nombre = serializers.CharField(source='recurso.nombre', read_only=True, default=None)
    bloque_nombre = serializers.CharField(source='bloque_horario.nombre', read_only=True)
    aprobado_por_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Reserva
        fields = [
            'id', 'docente', 'docente_nombre', 'laboratorio', 'laboratorio_nombre', 'recurso', 'recurso_nombre',
            'fecha', 'bloque_horario', 'bloque_nombre', 'estado', 'motivo_rechazo', 'aprobado_por',
            'aprobado_por_nombre', 'fecha_solicitud', 'fecha_resolucion',
        ]
        read_only_fields = ['estado', 'motivo_rechazo', 'aprobado_por', 'fecha_solicitud', 'fecha_resolucion']

    def get_docente_nombre(self, obj):
        return f"{obj.docente.usuario.nombres} {obj.docente.usuario.apellidos}".strip()

    def get_aprobado_por_nombre(self, obj):
        if not obj.aprobado_por:
            return None
        return f"{obj.aprobado_por.nombres} {obj.aprobado_por.apellidos}".strip() or obj.aprobado_por.email

    def validate(self, attrs):
        require_docente_or_auto_fill('docente', attrs, self.instance, self.context)

        laboratorio = attrs.get('laboratorio')
        recurso = attrs.get('recurso')
        if not laboratorio and not recurso:
            raise serializers.ValidationError('Debes indicar un laboratorio o un recurso a reservar.')

        fecha = attrs.get('fecha', getattr(self.instance, 'fecha', None))
        bloque = attrs.get('bloque_horario', getattr(self.instance, 'bloque_horario', None))
        qs = Reserva.objects.filter(fecha=fecha, bloque_horario=bloque, estado='aprobada')
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if laboratorio and qs.filter(laboratorio=laboratorio).exists():
            raise serializers.ValidationError('Ese laboratorio ya tiene una reserva aprobada en esa fecha y bloque.')
        if recurso and qs.filter(recurso=recurso).exists():
            raise serializers.ValidationError('Ese recurso ya tiene una reserva aprobada en esa fecha y bloque.')
        return attrs
