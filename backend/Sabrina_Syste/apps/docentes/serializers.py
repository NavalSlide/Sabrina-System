from rest_framework import serializers

from .models import AsignacionDocente, Docente, DisponibilidadDocente, DocenteLaboratorioAutorizado, DocenteMateriaAutorizada


class DocenteSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.SerializerMethodField()
    usuario_email = serializers.CharField(source='usuario.email', read_only=True)
    especialidad_nombre = serializers.CharField(source='especialidad.nombre', read_only=True, default=None)

    class Meta:
        model = Docente
        fields = [
            'id', 'usuario', 'usuario_nombre', 'usuario_email', 'especialidad', 'especialidad_nombre',
            'horas_contratadas_semanales', 'max_horas_diarias', 'max_horas_semanales', 'max_horas_continuas',
            'fecha_creacion', 'fecha_actualizacion',
        ]

    def get_usuario_nombre(self, obj):
        return f"{obj.usuario.nombres} {obj.usuario.apellidos}".strip() or obj.usuario.email


class DisponibilidadDocenteSerializer(serializers.ModelSerializer):
    docente_nombre = serializers.SerializerMethodField()

    class Meta:
        model = DisponibilidadDocente
        fields = ['id', 'docente', 'docente_nombre', 'dia_semana', 'hora_inicio', 'hora_fin', 'disponible']

    def get_docente_nombre(self, obj):
        return f"{obj.docente.usuario.nombres} {obj.docente.usuario.apellidos}".strip()

    def validate(self, attrs):
        inicio = attrs.get('hora_inicio', getattr(self.instance, 'hora_inicio', None))
        fin = attrs.get('hora_fin', getattr(self.instance, 'hora_fin', None))
        if inicio and fin and fin <= inicio:
            raise serializers.ValidationError('La hora de fin debe ser posterior a la hora de inicio.')
        return attrs


class DocenteMateriaAutorizadaSerializer(serializers.ModelSerializer):
    materia_nombre = serializers.CharField(source='materia.nombre', read_only=True)

    class Meta:
        model = DocenteMateriaAutorizada
        fields = ['id', 'docente', 'materia', 'materia_nombre']


class DocenteLaboratorioAutorizadoSerializer(serializers.ModelSerializer):
    laboratorio_nombre = serializers.CharField(source='laboratorio.nombre', read_only=True)

    class Meta:
        model = DocenteLaboratorioAutorizado
        fields = ['id', 'docente', 'laboratorio', 'laboratorio_nombre']


class AsignacionDocenteSerializer(serializers.ModelSerializer):
    docente_nombre = serializers.SerializerMethodField()
    curso_nombre = serializers.CharField(source='curso.nombre', read_only=True)
    paralelo_nombre = serializers.CharField(source='paralelo.nombre', read_only=True)
    materia_nombre = serializers.CharField(source='materia.nombre', read_only=True)
    periodo_lectivo_nombre = serializers.CharField(source='periodo_lectivo.nombre', read_only=True)

    class Meta:
        model = AsignacionDocente
        fields = [
            'id', 'docente', 'docente_nombre', 'curso', 'curso_nombre', 'paralelo', 'paralelo_nombre',
            'materia', 'materia_nombre', 'periodo_lectivo', 'periodo_lectivo_nombre', 'horas_asignadas',
            'fecha_creacion', 'fecha_actualizacion',
        ]

    def get_docente_nombre(self, obj):
        return f"{obj.docente.usuario.nombres} {obj.docente.usuario.apellidos}".strip()
