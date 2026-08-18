from django.shortcuts import render

# Create your views here.

def landing(request):
	"""Página de inicio bonita y simple para indicar que el backend está corriendo."""
	context = {
		'title': 'Por ahora',
		'status': 'Backend corriendo',
	}
	return render(request, 'seguimiento_academico/landing.html', context)
