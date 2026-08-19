from rest_framework import serializers

from .models import Curso, Especialidad, Jornada, Materia, Paralelo, PeriodoLectivo, PlanEstudio


class EspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidad
        fields = ['id', 'nombre', 'descripcion', 'fecha_creacion', 'fecha_actualizacion']


class JornadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jornada
        fields = ['id', 'nombre', 'hora_inicio', 'hora_fin', 'fecha_creacion', 'fecha_actualizacion']


class PeriodoLectivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PeriodoLectivo
        fields = ['id', 'nombre', 'fecha_inicio', 'fecha_fin', 'activo', 'estado', 'fecha_creacion', 'fecha_actualizacion']

    def validate(self, attrs):
        inicio = attrs.get('fecha_inicio', getattr(self.instance, 'fecha_inicio', None))
        fin = attrs.get('fecha_fin', getattr(self.instance, 'fecha_fin', None))
        if inicio and fin and fin <= inicio:
            raise serializers.ValidationError('La fecha de fin debe ser posterior a la fecha de inicio.')
        return attrs


class CursoSerializer(serializers.ModelSerializer):
    especialidad_nombre = serializers.CharField(source='especialidad.nombre', read_only=True, default=None)

    class Meta:
        model = Curso
        fields = ['id', 'nombre', 'nivel', 'especialidad', 'especialidad_nombre', 'fecha_creacion', 'fecha_actualizacion']


class MateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materia
        fields = ['id', 'nombre', 'descripcion', 'creditos', 'fecha_creacion', 'fecha_actualizacion']


class ParaleloSerializer(serializers.ModelSerializer):
    curso_nombre = serializers.CharField(source='curso.nombre', read_only=True)
    jornada_nombre = serializers.CharField(source='jornada.nombre', read_only=True)
    periodo_lectivo_nombre = serializers.CharField(source='periodo_lectivo.nombre', read_only=True)
    cupo_disponible = serializers.SerializerMethodField()

    class Meta:
        model = Paralelo
        fields = [
            'id', 'curso', 'curso_nombre', 'jornada', 'jornada_nombre', 'nombre',
            'periodo_lectivo', 'periodo_lectivo_nombre', 'capacidad_maxima', 'cupo_disponible',
            'fecha_creacion', 'fecha_actualizacion',
        ]

    def get_cupo_disponible(self, obj):
        return obj.capacidad_maxima - obj.estudiantes.count()


class PlanEstudioSerializer(serializers.ModelSerializer):
    especialidad_nombre = serializers.CharField(source='especialidad.nombre', read_only=True)
    curso_nombre = serializers.CharField(source='curso.nombre', read_only=True)
    materia_nombre = serializers.CharField(source='materia.nombre', read_only=True)
    periodo_lectivo_nombre = serializers.CharField(source='periodo_lectivo.nombre', read_only=True)

    class Meta:
        model = PlanEstudio
        fields = [
            'id', 'especialidad', 'especialidad_nombre', 'curso', 'curso_nombre',
            'materia', 'materia_nombre', 'periodo_lectivo', 'periodo_lectivo_nombre',
            'horas_semanales', 'fecha_creacion', 'fecha_actualizacion',
        ]
