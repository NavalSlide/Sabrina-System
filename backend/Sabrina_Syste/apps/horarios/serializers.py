from rest_framework import serializers

from .models import BloqueHorario, ConflictoHorario, Horario, MateriaConsecutivaRegla


class BloqueHorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloqueHorario
        fields = ['id', 'nombre', 'hora_inicio', 'hora_fin', 'es_receso', 'orden']


class HorarioSerializer(serializers.ModelSerializer):
    paralelo_nombre = serializers.SerializerMethodField()
    materia_nombre = serializers.CharField(source='materia.nombre', read_only=True)
    docente_nombre = serializers.SerializerMethodField()
    laboratorio_nombre = serializers.CharField(source='laboratorio.nombre', read_only=True, default=None)
    bloque_nombre = serializers.CharField(source='bloque_horario.nombre', read_only=True)
    periodo_lectivo_nombre = serializers.CharField(source='periodo_lectivo.nombre', read_only=True)
    dia_semana_display = serializers.SerializerMethodField()

    DIAS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']

    class Meta:
        model = Horario
        fields = [
            'id', 'paralelo', 'paralelo_nombre', 'materia', 'materia_nombre', 'docente', 'docente_nombre',
            'laboratorio', 'laboratorio_nombre', 'bloque_horario', 'bloque_nombre', 'dia_semana', 'dia_semana_display',
            'periodo_lectivo', 'periodo_lectivo_nombre', 'estado', 'fecha_creacion', 'fecha_modificacion',
        ]

    def get_paralelo_nombre(self, obj):
        return f"{obj.paralelo.curso.nombre} {obj.paralelo.nombre}"

    def get_docente_nombre(self, obj):
        return f"{obj.docente.usuario.nombres} {obj.docente.usuario.apellidos}".strip()

    def get_dia_semana_display(self, obj):
        try:
            return self.DIAS[obj.dia_semana]
        except IndexError:
            return obj.dia_semana

    def validate(self, attrs):
        docente = attrs.get('docente', getattr(self.instance, 'docente', None))
        laboratorio = attrs.get('laboratorio', getattr(self.instance, 'laboratorio', None))
        paralelo = attrs.get('paralelo', getattr(self.instance, 'paralelo', None))
        bloque = attrs.get('bloque_horario', getattr(self.instance, 'bloque_horario', None))
        dia = attrs.get('dia_semana', getattr(self.instance, 'dia_semana', None))
        periodo = attrs.get('periodo_lectivo', getattr(self.instance, 'periodo_lectivo', None))

        qs = Horario.objects.filter(dia_semana=dia, bloque_horario=bloque, periodo_lectivo=periodo)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if docente and qs.filter(docente=docente).exists():
            raise serializers.ValidationError('El docente ya tiene una clase asignada en ese dia y bloque horario.')
        if laboratorio and qs.filter(laboratorio=laboratorio).exists():
            raise serializers.ValidationError('El laboratorio ya esta ocupado en ese dia y bloque horario.')
        if paralelo and qs.filter(paralelo=paralelo).exists():
            raise serializers.ValidationError('El paralelo ya tiene una clase asignada en ese dia y bloque horario.')
        return attrs


class MateriaConsecutivaReglaSerializer(serializers.ModelSerializer):
    materia_a_nombre = serializers.CharField(source='materia_a.nombre', read_only=True)
    materia_b_nombre = serializers.CharField(source='materia_b.nombre', read_only=True)

    class Meta:
        model = MateriaConsecutivaRegla
        fields = ['id', 'materia_a', 'materia_a_nombre', 'materia_b', 'materia_b_nombre', 'permitido']


class ConflictoHorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConflictoHorario
        fields = ['id', 'horario_generado', 'tipo_conflicto', 'motivo', 'resuelto', 'alternativa_propuesta', 'fecha_deteccion']
        read_only_fields = ['fecha_deteccion']
