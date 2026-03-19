# 🚀 Planify - Smart Manager

Una aplicación web progresiva (PWA) **completamente responsiva** para gestionar suscripciones, planificar actividades y almacenar contraseñas de forma segura. Funciona perfectamente en **móvil, tablet y desktop** con soporte para Android nativo.

## ✨ Características

- 💳 **Gestor de Suscripciones**: Rastrea todas tus suscripciones y gastos mensuales
- 📅 **Planificador de Actividades**: Organiza tu día con un calendario interactivo
- 🔐 **Bóveda de Contraseñas**: Almacena contraseñas de forma segura con análisis de fortaleza
- 👤 **Autenticación de Usuarios**: Sistema completo de login/registro con Supabase
- ☁️ **Sincronización en la Nube**: Tus datos se sincronizan automáticamente entre dispositivos
- 📱 **Modo Invitado**: Usa la app sin cuenta, solo almacenamiento local
- 🔔 **Notificaciones Nativas**: Recordatorios de pagos 1 día antes (Android)
- 💾 **Almacenamiento Híbrido**: Local (Capacitor Preferences) + Nube (Supabase)
- 📱 **PWA Completa**: Instálala como app nativa en cualquier dispositivo
- 🖥️ **Diseño Responsivo**: Sidebar en desktop, bottom nav en móvil
- 🌙 **Modo Oscuro Premium**: Diseño moderno con gradientes púrpura/azul
- 🔍 **Búsqueda Global**: Busca en todas tus suscripciones, actividades y contraseñas

## 🎨 Diseño Responsivo

### 📱 Móvil (< 768px)
- Navegación inferior con 4 tabs
- Header compacto optimizado para touch
- Layout de una columna
- Safe area insets para notch/barra de estado

### 🖥️ Desktop (≥ 768px)
- Sidebar lateral fijo con navegación
- Header expandido con búsqueda amplia
- Layout multi-columna (2-3 columnas)
- Sin navegación inferior
- Scrollbar personalizado

## 📱 Generar App Android

Este proyecto está configurado con Capacitor para generar una app nativa de Android.

### Requisitos
- Android Studio instalado
- Java JDK 17 o superior
- Android SDK configurado

### Comandos rápidos

```bash
# Build y sincronizar con Android
npm run android:build

# Abrir en Android Studio
npm run android:open

# Build y ejecutar en dispositivo/emulador
npm run android:run
```

Para instrucciones detalladas, consulta:
- [ANDROID_BUILD.md](./ANDROID_BUILD.md) - Guía completa de build
- [ANDROID_DEBUG.md](./ANDROID_DEBUG.md) - Solución de problemas
- [LIVE_RELOAD.md](./LIVE_RELOAD.md) - Desarrollo en tiempo real

## 🛠️ Tecnologías

### Frontend
- React 19
- React Router DOM
- Tailwind CSS (diseño responsivo)
- Lucide React (iconos)
- Vite
- Capacitor (Android)
- Supabase (autenticación y base de datos)
- @capacitor/preferences (almacenamiento local)
- @capacitor/local-notifications (notificaciones nativas)

### Backend (Supabase)
- PostgreSQL (base de datos en la nube)
- Row Level Security (RLS)
- Autenticación integrada
- API REST automática

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repo>
cd planify
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` y configura tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

4. **Configurar base de datos en Supabase**

- Ve a [Supabase](https://supabase.com) y crea un proyecto
- En el SQL Editor, ejecuta el contenido de `supabase-schema.sql`
- Esto creará las tablas y políticas de seguridad necesarias

5. **Iniciar la aplicación**

```bash
npm run dev
```

La aplicación estará disponible en http://localhost:5173

## 📱 Instalar como PWA

### En Android (Chrome/Edge)
1. Abre la app en el navegador
2. Toca el menú (⋮)
3. Selecciona "Instalar aplicación" o "Agregar a pantalla de inicio"

### En iOS (Safari)
1. Abre la app en Safari
2. Toca el botón de compartir
3. Selecciona "Agregar a pantalla de inicio"

### En Desktop (Chrome/Edge)
1. Abre la app en el navegador
2. Busca el ícono de instalación en la barra de direcciones
3. Haz clic en "Instalar"

## 🔔 Notificaciones Nativas (Android)

La app envía notificaciones nativas en Android cuando falta 1 día para el pago de una suscripción.

### Requisitos
- App instalada en Android (no funciona en navegador web)
- Permisos de notificación otorgados
- Al menos una suscripción activa

### Cómo funcionan
1. Las notificaciones se programan automáticamente al crear/editar suscripciones
2. Se envían 1 día antes de la fecha de pago
3. Al tocar la notificación, se abre la app

### Probar notificaciones
Para probar, crea una suscripción con fecha de pago para mañana.

## 🗄️ Base de Datos

La aplicación usa **Supabase** (PostgreSQL) para almacenamiento en la nube y **Capacitor Preferences** para almacenamiento local.

### Tablas en Supabase

- **subscriptions**: Suscripciones y pagos recurrentes
- **activities**: Actividades y tareas planificadas
- **passwords**: Contraseñas almacenadas

### Sincronización Híbrida

- **Con cuenta**: Los datos se guardan en Supabase y se sincronizan entre dispositivos
- **Modo invitado**: Los datos se guardan solo localmente en el dispositivo
- **Offline**: Si no hay conexión, se usa el almacenamiento local automáticamente

### Row Level Security (RLS)

Todas las tablas tienen políticas RLS que garantizan que cada usuario solo puede acceder a sus propios datos.

## 🔒 Seguridad

✅ **Implementado**:

1. **Autenticación**: Sistema completo con Supabase Auth
2. **Row Level Security**: Cada usuario solo accede a sus datos
3. **HTTPS**: Supabase usa HTTPS por defecto
4. **Almacenamiento seguro**: Capacitor Preferences encripta datos locales

⚠️ **Para producción adicional**:

1. **Encriptar contraseñas**: Implementa encriptación adicional (AES-256) antes de guardar
2. **2FA**: Considera agregar autenticación de dos factores
3. **Rate limiting**: Implementa límites de peticiones
4. **Validación**: Valida todos los inputs en frontend y backend

## 📝 API Endpoints

### Subscriptions
- `GET /api/subscriptions` - Obtener todas las suscripciones
- `POST /api/subscriptions` - Crear suscripción
- `PUT /api/subscriptions/:id` - Actualizar suscripción
- `DELETE /api/subscriptions/:id` - Eliminar suscripción

### Activities
- `GET /api/activities` - Obtener todas las actividades
- `GET /api/activities?date=YYYY-MM-DD` - Filtrar por fecha
- `POST /api/activities` - Crear actividad
- `PUT /api/activities/:id` - Actualizar actividad
- `DELETE /api/activities/:id` - Eliminar actividad

### Passwords
- `GET /api/passwords` - Obtener todas las contraseñas
- `POST /api/passwords` - Crear contraseña
- `PUT /api/passwords/:id` - Actualizar contraseña
- `DELETE /api/passwords/:id` - Eliminar contraseña

### Notifications
- `GET /api/notifications/vapid-public-key` - Obtener clave pública VAPID
- `POST /api/notifications/subscribe` - Suscribirse a notificaciones
- `POST /api/notifications/unsubscribe` - Desuscribirse
- `POST /api/notifications/test` - Enviar notificación de prueba

## 🚀 Despliegue

### Frontend (Vercel/Netlify)

1. Build del frontend:
```bash
npm run build
```

2. Despliega la carpeta `dist/`

### Backend (Railway/Render/Heroku)

1. Asegúrate de tener las variables de entorno configuradas
2. El servidor escucha en el puerto definido por `process.env.PORT`
3. Actualiza `VITE_API_URL` en el frontend con la URL del backend

## 🎯 Características PWA

- ✅ Manifest.json completo con shortcuts
- ✅ Service Worker para funcionamiento offline
- ✅ Iconos SVG optimizados
- ✅ Splash screen personalizado
- ✅ Share Target API
- ✅ Instalable en todos los dispositivos
- ✅ Theme color adaptativo

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🎨 Créditos

- Iconos: [Lucide Icons](https://lucide.dev/)
- Fuente: [Outfit - Google Fonts](https://fonts.google.com/specimen/Outfit)

---

Hecho con ❤️ para gestionar tu vida digital en cualquier dispositivo 📱💻
