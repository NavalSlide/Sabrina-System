# Sabrina - Frontend

Sistema de Gestión Académica | Frontend React + TypeScript + Vite

## 📋 Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0 o yarn
- Git

## 🚀 Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env
cp .env.example .env

# 3. Iniciar servidor de desarrollo
npm run dev
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.tsx
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Card.tsx
│   └── StatCard.tsx
├── pages/              # Páginas principales
│   ├── Dashboard.tsx
│   └── Login.tsx
├── services/           # Servicios de API
│   ├── api.ts         # Configuración de axios
│   └── userService.ts # Servicios de usuario
├── hooks/             # Hooks personalizados
├── utils/             # Funciones utilitarias
├── types/             # Definiciones de tipos TypeScript
│   └── index.ts
├── App.tsx            # Componente principal
├── main.tsx           # Punto de entrada
└── index.css          # Estilos globales
```

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo en http://localhost:5173

# Build
npm run build        # Construye para producción
npm run preview      # Previsualiza la build de producción localmente

# Linting
npm run lint         # Ejecuta ESLint para verificar calidad del código
```

## 🎨 Tecnologías Utilizadas

- **React 18**: Librería UI
- **TypeScript**: Tipado estático
- **Vite**: Build tool de alto rendimiento
- **React Router v6**: Enrutamiento
- **Axios**: Cliente HTTP
- **Tailwind CSS**: Framework de estilos
- **ESLint**: Linter de código

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8000/api
```

### Tailwind CSS

La configuración está en `tailwind.config.js` con estilos personalizados para:
- Colores primarios y secundarios
- Tipografía
- Espaciado y bordes

### TypeScript

Rutas de importación configuradas:
- `@components/*` → `src/components`
- `@pages/*` → `src/pages`
- `@services/*` → `src/services`
- `@types/*` → `src/types`
- `@utils/*` → `src/utils`
- `@hooks/*` → `src/hooks`

## 🔐 Autenticación

El proyecto incluye:
- Página de login completa
- Interceptores de axios para tokens
- LocalStorage para persistencia
- Protección de rutas (próximamente)

## 📱 Características Principales

✅ Dashboard con estadísticas
✅ Sidebar con navegación
✅ Header con notificaciones
✅ Sistema de login
✅ Componentes reutilizables
✅ Integración con API REST
✅ Tipado TypeScript completo
✅ Responsive Design con Tailwind

## 📚 Próximos Pasos

- [ ] Implementar autenticación real
- [ ] Crear páginas de CRUD para cada módulo
- [ ] Implementar estado global (Context/Zustand)
- [ ] Agregar formularios validados
- [ ] Implementar paginación y filtros
- [ ] Tests unitarios
- [ ] Mejoras de performance

## 🤝 Integración con Backend

El frontend está configurado para conectarse al backend Django en `http://localhost:8000`.

### Endpoints esperados:
- `POST /api/login` - Autenticación
- `GET /api/users/me` - Usuario actual
- `GET /api/users` - Lista de usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/{id}` - Actualizar usuario
- `DELETE /api/users/{id}` - Eliminar usuario

## 📝 Notas

- El puerto de desarrollo es `5173`
- El proxy está configurado para redireccionar `/api` al backend
- Los tokens se almacenan en localStorage
- Todos los componentes usan Tailwind CSS

## 🐛 Troubleshooting

**Error: "command not found: npm"**
- Asegúrate de que Node.js está correctamente instalado
- Reinicia la terminal después de instalar Node.js

**Error de conexión con el backend**
- Verifica que el servidor Django está ejecutándose
- Comprueba la URL en la variable de entorno `VITE_API_URL`

**Estilos Tailwind no se aplican**
- Ejecuta `npm install` nuevamente
- Limpia la caché: `rm -rf node_modules .vite`

## 📄 Licencia

© 2024 Sabrina - Sistema de Gestión Académica
