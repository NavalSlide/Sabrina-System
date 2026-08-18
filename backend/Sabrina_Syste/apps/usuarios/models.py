from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.conf import settings
from Sabrina_Syste.apps.core.models import TimestampedModel


class Rol(models.Model):
	nombre = models.CharField(max_length=150)
	descripcion = models.TextField(blank=True)

	def __str__(self):
		return self.nombre


class Permiso(models.Model):
	codigo = models.CharField(max_length=150, unique=True)
	descripcion = models.TextField(blank=True)

	def __str__(self):
		return self.codigo


class RolPermiso(models.Model):
	rol = models.ForeignKey(Rol, on_delete=models.CASCADE, related_name='permisos')
	permiso = models.ForeignKey(Permiso, on_delete=models.CASCADE, related_name='roles')
	fecha_asignacion = models.DateTimeField(auto_now_add=True)

	class Meta:
		unique_together = (('rol', 'permiso'),)


class UsuarioManager(BaseUserManager):
	use_in_migrations = True

	def _create_user(self, email, password, **extra_fields):
		if not email:
			raise ValueError('El email debe proporcionarse')
		email = self.normalize_email(email)
		user = self.model(email=email, **extra_fields)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_user(self, email, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', False)
		extra_fields.setdefault('is_superuser', False)
		return self._create_user(email, password, **extra_fields)

	def create_superuser(self, email, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', True)
		extra_fields.setdefault('is_superuser', True)
		if extra_fields.get('is_staff') is not True:
			raise ValueError('Superuser must have is_staff=True.')
		if extra_fields.get('is_superuser') is not True:
			raise ValueError('Superuser must have is_superuser=True.')
		return self._create_user(email, password, **extra_fields)


class Usuario(AbstractUser, TimestampedModel):
	username = None
	email = models.EmailField('email address', unique=True)
	rol = models.ForeignKey(Rol, null=True, blank=True, on_delete=models.SET_NULL, related_name='usuarios')
	nombres = models.CharField(max_length=150, blank=True)
	apellidos = models.CharField(max_length=150, blank=True)
	telefono = models.CharField(max_length=30, blank=True, null=True)
	activo = models.BooleanField(default=True)
	intentos_fallidos = models.IntegerField(default=0)
	bloqueado_hasta = models.DateTimeField(null=True, blank=True)
	preferencia_modo_oscuro = models.BooleanField(default=False)

	objects = UsuarioManager()

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = []

	def __str__(self):
		return self.email


class SesionActiva(models.Model):
	usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sesiones')
	token_sesion = models.CharField(max_length=255)
	ip_origen = models.GenericIPAddressField(null=True, blank=True)
	fecha_inicio = models.DateTimeField(auto_now_add=True)
	fecha_ultima_actividad = models.DateTimeField(auto_now=True)
	activa = models.BooleanField(default=True)


class TokenRecuperacion(models.Model):
	usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tokens_recuperacion')
	token = models.CharField(max_length=255, unique=True)
	fecha_expiracion = models.DateTimeField()
	usado = models.BooleanField(default=False)

