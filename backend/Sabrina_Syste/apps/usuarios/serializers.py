from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import Permiso, Rol, RolPermiso, Usuario


class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = ['id', 'nombre', 'descripcion']


class PermisoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permiso
        fields = ['id', 'codigo', 'descripcion']


class RolPermisoSerializer(serializers.ModelSerializer):
    rol_nombre = serializers.CharField(source='rol.nombre', read_only=True)
    permiso_codigo = serializers.CharField(source='permiso.codigo', read_only=True)

    class Meta:
        model = RolPermiso
        fields = ['id', 'rol', 'rol_nombre', 'permiso', 'permiso_codigo', 'fecha_asignacion']


class UsuarioDirectorySerializer(serializers.ModelSerializer):
    """Minimal, non-admin-safe user listing (for message recipient pickers etc.)."""

    rol_nombre = serializers.CharField(source='rol.nombre', read_only=True, default=None)

    class Meta:
        model = Usuario
        fields = ['id', 'nombres', 'apellidos', 'email', 'rol_nombre']


class UsuarioAdminSerializer(serializers.ModelSerializer):
    """Admin-facing user management: list/create/update/deactivate.

    Distinct from the public register/login views in views.py - those stay
    untouched since they already work end to end for self-service signup.
    """

    rol_nombre = serializers.CharField(source='rol.nombre', read_only=True, default=None)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Usuario
        fields = [
            'id', 'email', 'nombres', 'apellidos', 'telefono', 'rol', 'rol_nombre',
            'activo', 'is_active', 'is_staff', 'password', 'date_joined',
        ]
        read_only_fields = ['date_joined']

    def validate_password(self, value):
        if not value:
            return value
        try:
            validate_password(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(list(exc.messages))
        return value

    def validate(self, attrs):
        # A new account needs a password to ever be able to log in - only
        # optional when editing an existing user (blank = keep current one).
        if self.instance is None and not attrs.get('password'):
            raise serializers.ValidationError({'password': 'La contraseña es obligatoria al crear un usuario nuevo.'})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        activo = validated_data.pop('activo', True)
        user = Usuario.objects.create_user(password=password, activo=activo, is_active=activo, **validated_data)
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if 'activo' in validated_data:
            validated_data.setdefault('is_active', validated_data['activo'])
        for field, value in validated_data.items():
            setattr(instance, field, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
