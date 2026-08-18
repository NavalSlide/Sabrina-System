import os
import socket
import json
import urllib.request
import urllib.parse
from urllib.parse import urlparse
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.conf import settings


class MissingPyngrok(Exception):
    pass


class Command(BaseCommand):
    help = 'Start the Django dev server and expose it via ngrok (pyngrok)'

    def add_arguments(self, parser):
        parser.add_argument('--port', type=int, default=8000, help='Local port to expose')

    def handle(self, *args, **options):
        port = options.get('port', 8000)

        try:
            from pyngrok import ngrok
        except Exception:
            raise MissingPyngrok(
                "pyngrok no está instalado. Instala dependencias: `pip install -r ../requirements.txt` o `pip install pyngrok`"
            )

        # Prefer an explicit env var, then Django settings
        token = os.environ.get('NGROK_AUTH_TOKEN') or getattr(settings, 'NGROK_AUTH_TOKEN', None)
        if token:
            try:
                ngrok.set_auth_token(token)
                self.stdout.write(self.style.NOTICE('Ngrok: auth token configurado desde NGROK_AUTH_TOKEN'))
            except Exception:
                # continue and let ngrok report auth errors
                pass

        self.stdout.write(f"Iniciando túnel ngrok en el puerto {port}...")
        try:
            tunnel = ngrok.connect(port, "http")
        except Exception as e:
            self.stderr.write(
                "Error al iniciar ngrok: {0}\nAsegúrate de tener una cuenta ngrok y un authtoken válido."
                " Ejecuta `ngrok authtoken <TOKEN>`, o exporta la variable de entorno NGROK_AUTH_TOKEN.".format(e)
            )
            return

        public_url = tunnel.public_url
        self.stdout.write(self.style.SUCCESS(f"Ngrok URL pública: {public_url}"))

        # Try to resolve the public host to IPv4 addresses and print them
        try:
            parsed = urlparse(public_url)
            host = parsed.hostname
            ips = []

            # Attempt local DNS resolution (IPv4)
            try:
                for res in socket.getaddrinfo(host, None):
                    ip = res[4][0]
                    try:
                        socket.inet_pton(socket.AF_INET, ip)
                        if ip not in ips:
                            ips.append(ip)
                    except Exception:
                        # not IPv4
                        pass
            except Exception:
                pass

            # Fallback: DNS-over-HTTPS (Cloudflare)
            if not ips:
                try:
                    doh_url = f"https://cloudflare-dns.com/dns-query?name={urllib.parse.quote(host)}&type=A"
                    req = urllib.request.Request(doh_url, headers={"Accept": "application/dns-json"})
                    with urllib.request.urlopen(req, timeout=5) as resp:
                        data = json.load(resp)
                    for ans in data.get('Answer', []):
                        if ans.get('type') == 1:
                            ip = ans.get('data')
                            if ip not in ips:
                                ips.append(ip)
                except Exception:
                    pass

            if ips:
                self.stdout.write(self.style.SUCCESS(f"IP(s) públicas: {', '.join(ips)}"))
            else:
                self.stdout.write(self.style.NOTICE('No se pudo resolver la IP pública del host ngrok (túnel activo pero DNS no resolvió).'))
        except Exception:
            # suppress any unexpected errors in resolution
            pass
        self.stdout.write(f'Abriendo servidor de desarrollo Django en 0.0.0.0:{port} — press CTRL+C to stop')

        try:
            call_command('runserver', f'0.0.0.0:{port}', use_reloader=False)
        except KeyboardInterrupt:
            self.stdout.write('Interrumpido por usuario, cerrando túnel ngrok...')
        finally:
            try:
                ngrok.disconnect(public_url)
            except Exception:
                pass
            try:
                ngrok.kill()
            except Exception:
                pass
