from rest_framework import serializers

from Sabrina_Syste.apps.core.validators import require_docente_or_auto_fill
from Sabrina_Syste.apps.docentes.models import Docente

from .models import Asistencia, Calificacion, Estudiante, IndicadorAcademico, Representante


class EstudianteSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.SerializerMethodField()
    usuario_email = serializers.CharField(source='usuario.email', read_only=True)
    paralelo_nombre = serializers.SerializerMethodField()
    curso_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Estudiante
        fields = [
            'id', 'usuario', 'usuario_nombre', 'usuario_email', 'paralelo', 'paralelo_nombre', 'curso_nombre',
            'fecha_nacimiento', 'fecha_ingreso', 'estado', 'fecha_creacion', 'fecha_actualizacion',
        ]

    def get_usuario_nombre(self, obj):
        return f"{obj.usuario.nombres} {obj.usuario.apellidos}".strip() or obj.usuario.email

    def get_paralelo_nombre(self, obj):
        return f"{obj.paralelo.curso.nombre} {obj.paralelo.nombre}" if obj.paralelo else None

    def get_curso_nombre(self, obj):
        return obj.curso.nombre if obj.curso else None


class AsistenciaSerializer(serializers.ModelSerializer):
    estudiante_nombre = serializers.SerializerMethodField()
    paralelo_nombre = serializers.SerializerMethodField()
    registrado_por_nombre = serializers.SerializerMethodField()
    # Optional on input: the view fills it in from request.user's docente
    # profile when omitted, so a docente doesn't have to pick themselves.
    registrado_por = serializers.PrimaryKeyRelatedField(queryset=Docente.objects.all(), required=False)

    class Meta:
        model = Asistencia
        fields = [
            'id', 'estudiante', 'estudiante_nombre', 'paralelo', 'paralelo_nombre', 'fecha', 'estado',
            'registrado_por', 'registrado_por_nombre', 'fecha_creacion', 'fecha_actualizacion',
        ]

    def get_estudiante_nombre(self, obj):
        return f"{obj.estudiante.usuario.nombres} {obj.estudiante.usuario.apellidos}".strip()

    def get_paralelo_nombre(self, obj):
        return f"{obj.paralelo.curso.nombre} {obj.paralelo.nombre}"

    def get_registrado_por_nombre(self, obj):
        return f"{obj.registrado_por.usuario.nombres} {obj.registrado_por.usuario.apellidos}".strip()

    def validate(self, attrs):
        require_docente_or_auto_fill('registrado_por', attrs, self.instance, self.context)
        return attrs


class CalificacionSerializer(serializers.ModelSerializer):
    estudiante_nombre = serializers.SerializerMethodField()
    materia_nombre = serializers.CharField(source='materia.nombre', read_only=True)
    paralelo_nombre = serializers.SerializerMethodField()
    docente_nombre = serializers.SerializerMethodField()
    periodo_lectivo_nombre = serializers.CharField(source='periodo_lectivo.nombre', read_only=True)
    # Optional on input: the view fills it in from request.user's docente
    # profile when omitted, so a docente doesn't have to pick themselves.
    docente = serializers.PrimaryKeyRelatedField(queryset=Docente.objects.all(), required=False)

    class Meta:
        model = Calificacion
        fields = [
            'id', 'estudiante', 'estudiante_nombre', 'materia', 'materia_nombre', 'paralelo', 'paralelo_nombre',
            'periodo_lectivo', 'periodo_lectivo_nombre', 'docente', 'docente_nombre', 'nota', 'tipo_evaluacion',
            'fecha_registro',
        ]
        read_only_fields = ['fecha_registro']

    def get_estudiante_nombre(self, obj):
        return f"{obj.estudiante.usuario.nombres} {obj.estudiante.usuario.apellidos}".strip()

    def get_paralelo_nombre(self, obj):
        return f"{obj.paralelo.curso.nombre} {obj.paralelo.nombre}"

    def get_docente_nombre(self, obj):
        return f"{obj.docente.usuario.nombres} {obj.docente.usuario.apellidos}".strip()

    def validate_nota(self, value):
        if value < 0 or value > 20:
            raise serializers.ValidationError('La nota debe estar entre 0 y 20.')
        return value

    def validate(self, attrs):
        require_docente_or_auto_fill('docente', attrs, self.instance, self.context)
        return attrs


class RepresentanteSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.SerializerMethodField()
    estudiantes_nombres = serializers.SerializerMethodField()

    class Meta:
        model = Representante
        fields = ['id', 'usuario', 'usuario_nombre', 'estudiantes', 'estudiantes_nombres', 'parentesco']

    def get_usuario_nombre(self, obj):
        return f"{obj.usuario.nombres} {obj.usuario.apellidos}".strip()

    def get_estudiantes_nombres(self, obj):
        return [f"{e.usuario.nombres} {e.usuario.apellidos}".strip() for e in obj.estudiantes.all()]


class IndicadorAcademicoSerializer(serializers.ModelSerializer):
    paralelo_nombre = serializers.SerializerMethodField()
    docente_nombre = serializers.SerializerMethodField()
    materia_nombre = serializers.CharField(source='materia.nombre', read_only=True, default=None)
    periodo_lectivo_nombre = serializers.CharField(source='periodo_lectivo.nombre', read_only=True)

    class Meta:
        model = IndicadorAcademico
        fields = [
            'id', 'paralelo', 'paralelo_nombre', 'docente', 'docente_nombre', 'materia', 'materia_nombre',
            'periodo_lectivo', 'periodo_lectivo_nombre', 'promedio', 'indice_reprobacion', 'indice_asistencia',
            'fecha_calculo',
        ]
        read_only_fields = ['fecha_calculo']

    def get_paralelo_nombre(self, obj):
        return f"{obj.paralelo.curso.nombre} {obj.paralelo.nombre}" if obj.paralelo else None

    def get_docente_nombre(self, obj):
        return f"{obj.docente.usuario.nombres} {obj.docente.usuario.apellidos}".strip() if obj.docente else None
