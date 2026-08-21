# -*- coding: utf-8 -*-
"""Reglas de negocio para la generacion de horarios.

Cada funcion valida una regla especifica y lanza serializers.ValidationError
con un mensaje claro cuando se incumple. Se usan desde HorarioSerializer.validate().
"""
from datetime import datetime, date

from rest_framework import serializers

DIAS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
MAX_HORAS_DIA_CURSO = 8
MAX_HORAS_CONSECUTIVAS_MATERIA = 2


def dia_nombre(dia_semana):
    try:
        return DIAS[dia_semana]
    except (IndexError, TypeError):
        return str(dia_semana)


def bloque_duracion_horas(bloque):
    """Duracion de un bloque horario en horas (float)."""
    dt_inicio = datetime.combine(date.today(), bloque.hora_inicio)
    dt_fin = datetime.combine(date.today(), bloque.hora_fin)
    return (dt_fin - dt_inicio).total_seconds() / 3600


def check_no_receso(bloque):
    """Regla: el sistema debe impedir asignar clases durante el receso."""
    if bloque is not None and bloque.es_receso:
        raise serializers.ValidationError(
            f'El bloque "{bloque.nombre}" es un receso; no se pueden asignar clases en el.'
        )


def check_capacidad_laboratorio(laboratorio, paralelo):
    """Regla: los laboratorios deben respetar su capacidad maxima."""
    if not laboratorio or not paralelo:
        return
    if laboratorio.capacidad and paralelo.capacidad_maxima and paralelo.capacidad_maxima > laboratorio.capacidad:
        raise serializers.ValidationError(
            f'El laboratorio "{laboratorio.nombre}" tiene capacidad para {laboratorio.capacidad} '
            f'estudiantes, pero el paralelo admite hasta {paralelo.capacidad_maxima}.'
        )


def check_horas_dia(Horario, paralelo, dia_semana, periodo, nuevo_bloque, exclude_pk=None):
    """Regla: un curso (paralelo) no puede superar ocho horas de clase por dia."""
    if not (paralelo and dia_semana is not None and periodo and nuevo_bloque):
        return
    qs = Horario.objects.filter(
        paralelo=paralelo, dia_semana=dia_semana, periodo_lectivo=periodo,
    ).select_related('bloque_horario')
    if exclude_pk:
        qs = qs.exclude(pk=exclude_pk)

    total = bloque_duracion_horas(nuevo_bloque)
    for h in qs:
        total += bloque_duracion_horas(h.bloque_horario)

    if total > MAX_HORAS_DIA_CURSO:
        raise serializers.ValidationError(
            f'El paralelo superaria las {MAX_HORAS_DIA_CURSO} horas de clase permitidas el '
            f'{dia_nombre(dia_semana)} (total resultante: {round(total, 1)}h).'
        )


def check_consecutivas_materia(Horario, paralelo, materia, dia_semana, periodo, nuevo_orden, exclude_pk=None):
    """Regla: no se pueden asignar mas de dos horas consecutivas de la misma materia."""
    if not (paralelo and materia and dia_semana is not None and periodo and nuevo_orden is not None):
        return
    qs = Horario.objects.filter(
        paralelo=paralelo, dia_semana=dia_semana, periodo_lectivo=periodo, materia=materia,
    )
    if exclude_pk:
        qs = qs.exclude(pk=exclude_pk)

    ordenes = sorted(set(qs.values_list('bloque_horario__orden', flat=True)) | {nuevo_orden})
    idx = ordenes.index(nuevo_orden)

    run = 1
    i = idx - 1
    while i >= 0 and ordenes[i] == ordenes[i + 1] - 1:
        run += 1
        i -= 1
    i = idx + 1
    while i < len(ordenes) and ordenes[i] == ordenes[i - 1] + 1:
        run += 1
        i += 1

    if run > MAX_HORAS_CONSECUTIVAS_MATERIA:
        raise serializers.ValidationError(
            f'No se pueden asignar mas de {MAX_HORAS_CONSECUTIVAS_MATERIA} horas consecutivas de '
            f'"{materia.nombre}" para este paralelo el {dia_nombre(dia_semana)}.'
        )


def check_carga_semanal_docente(Horario, docente, periodo, nuevo_bloque, exclude_pk=None):
    """Regla: un docente no puede superar su carga horaria semanal."""
    if not (docente and periodo and nuevo_bloque):
        return
    qs = Horario.objects.filter(docente=docente, periodo_lectivo=periodo).select_related('bloque_horario')
    if exclude_pk:
        qs = qs.exclude(pk=exclude_pk)

    total = bloque_duracion_horas(nuevo_bloque)
    for h in qs:
        total += bloque_duracion_horas(h.bloque_horario)

    if total > docente.max_horas_semanales:
        nombre = f"{docente.usuario.nombres} {docente.usuario.apellidos}".strip()
        raise serializers.ValidationError(
            f'{nombre} superaria su carga horaria semanal maxima de {docente.max_horas_semanales}h '
            f'(total resultante: {round(total, 1)}h).'
        )
