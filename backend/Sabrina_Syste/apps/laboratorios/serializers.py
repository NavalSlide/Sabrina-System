from rest_framework import serializers

from .models import EquipoLaboratorio, Laboratorio, SoftwareInstalado


class EquipoLaboratorioSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipoLaboratorio
        fields = ['id', 'laboratorio', 'nombre', 'cantidad', 'estado']


class SoftwareInstaladoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoftwareInstalado
        fields = ['id', 'laboratorio', 'nombre', 'version']


class LaboratorioSerializer(serializers.ModelSerializer):
    equipos = EquipoLaboratorioSerializer(many=True, read_only=True)
    softwares = SoftwareInstaladoSerializer(many=True, read_only=True)

    class Meta:
        model = Laboratorio
        fields = ['id', 'nombre', 'capacidad', 'estado', 'ubicacion', 'equipos', 'softwares', 'fecha_creacion', 'fecha_actualizacion']
