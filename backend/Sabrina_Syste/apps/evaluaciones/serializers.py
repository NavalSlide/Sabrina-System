from rest_framework import serializers

from Sabrina_Syste.apps.core.validators import require_docente_or_auto_fill
from Sabrina_Syste.apps.docentes.models import Docente

from .models import Actividad, ConfiguracionEvaluacion, Evaluacion


class ActividadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actividad
        fields = ['id', 'nombre', 'fecha', 'descripcion']


class EvaluacionSerializer(serializers.ModelSerializer):
    paralelo_nombre = serializers.SerializerMethodField()
    materia_nombre = serializers.CharField(source='materia.nombre', read_only=True)
    docente_nombre = serializers.SerializerMethodField()
    periodo_lectivo_nombre = serializers.CharField(source='periodo_lectivo.nombre', read_only=True)
    # Optional on input: the view fills it in from request.user's docente
    # profile when omitted, so a docente doesn't have to pick themselves.
    docente = serializers.PrimaryKeyRelatedField(queryset=Docente.objects.all(), required=False)

    class Meta:
        model = Evaluacion
        fields = [
            'id', 'paralelo', 'paralelo_nombre', 'materia', 'materia_nombre', 'docente', 'docente_nombre',
            'periodo_lectivo', 'periodo_lectivo_nombre', 'tipo', 'fecha', 'descripcion',
        ]

    def get_paralelo_nombre(self, obj):
        return f"{obj.paralelo.curso.nombre} {obj.paralelo.nombre}"

    def get_docente_nombre(self, obj):
        return f"{obj.docente.usuario.nombres} {obj.docente.usuario.apellidos}".strip()

    def validate(self, attrs):
        require_docente_or_auto_fill('docente', attrs, self.instance, self.context)

        paralelo = attrs.get('paralelo', getattr(self.instance, 'paralelo', None))
        fecha = attrs.get('fecha', getattr(self.instance, 'fecha', None))
        periodo = attrs.get('periodo_lectivo', getattr(self.instance, 'periodo_lectivo', None))

        config = ConfiguracionEvaluacion.objects.filter(periodo_lectivo=periodo).first()
        max_por_dia = config.max_evaluaciones_por_dia if config else 1

        qs = Evaluacion.objects.filter(paralelo=paralelo, fecha=fecha)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.count() >= max_por_dia:
            raise serializers.ValidationError(
                f'Ya se alcanzo el maximo de {max_por_dia} evaluacion(es) para ese paralelo en esa fecha.'
            )
        return attrs


class ConfiguracionEvaluacionSerializer(serializers.ModelSerializer):
    periodo_lectivo_nombre = serializers.CharField(source='periodo_lectivo.nombre', read_only=True)

    class Meta:
        model = ConfiguracionEvaluacion
        fields = ['id', 'periodo_lectivo', 'periodo_lectivo_nombre', 'max_evaluaciones_por_dia']
