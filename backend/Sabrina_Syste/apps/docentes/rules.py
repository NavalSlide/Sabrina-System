# -*- coding: utf-8 -*-
"""Reglas de negocio relacionadas con docentes, reutilizadas por otros modulos
(horarios, asignaciones) para no duplicar la logica de validacion."""
from rest_framework import serializers


def check_materia_autorizada(docente, materia):
    """Regla: una materia solo puede ser impartida por docentes autorizados."""
    from .models import DocenteMateriaAutorizada

    if not docente or not materia:
        return
    if not DocenteMateriaAutorizada.objects.filter(docente=docente, materia=materia).exists():
        nombre = f"{docente.usuario.nombres} {docente.usuario.apellidos}".strip()
        raise serializers.ValidationError(
            f'{nombre} no esta autorizado para dictar "{materia.nombre}". '
            f'Autorizalo primero en Docentes > Materias autorizadas.'
        )
