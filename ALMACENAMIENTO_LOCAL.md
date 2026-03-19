# 📱 Almacenamiento Local - Planify

## ✅ Cambios Realizados

La app ahora **guarda todo localmente en el dispositivo** usando **Capacitor Preferences**. Ya no necesitas el backend para que funcione.

## 🔧 Cómo Funciona

### Antes (con Backend)
```
App → API (localhost:3001) → SQLite Database
```
❌ Problema: En Android no funciona porque localhost no existe

### Ahora (Almacenamiento Local)
```
App → Capacitor Preferences → Almacenamiento del Dispositivo
```
✅ Funciona en:
- Web (localStorage)
- Android (SharedPreferences)
- iOS (UserDefaults)

## 📦 Nuevo Plugin Instalado

```bash
npm install @capacitor/preferences
```

Este plugin guarda datos de forma nativa en cada plataforma.

## 🗂️ Nuevo Archivo: `src/services/storage.js`

Reemplaza completamente `src/services/api.js` con funciones que guardan localmente:

### Funciones Disponibles

#### Subscriptions
- `subscriptionsStorage.getAll()` - Obtener todas
- `subscriptionsStorage.create(data)` - Crear nueva
- `subscriptionsStorage.update(id, data)` - Actualizar
- `subscriptionsStorage.delete(id)` - Eliminar

#### Activities
- `activitiesStorage.getAll()` - Obtener todas
- `activitiesStorage.getByDate(date)` - Por fecha
- `activitiesStorage.create(data)` - Crear nueva
- `activitiesStorage.update(id, data)` - Actualizar
- `activitiesStorage.delete(id)` - Eliminar

#### Passwords
- `passwordsStorage.getAll()` - Obtener todas
- `passwordsStorage.create(data)` - Crear nueva
- `passwordsStorage.update(id, data)` - Actualizar
- `passwordsStorage.delete(id)` - Eliminar

#### Utilidades
- `storageUtils.clearAll()` - Limpiar todo
- `storageUtils.exportData()` - Exportar datos (JSON)
- `storageUtils.importData(data)` - Importar datos
- `storageUtils.seedData()` - Datos de ejemplo

## 📝 Archivos Modificados

1. **src/App.jsx**
   - Importa `storage.js` en lugar de `api.js`
   - Usa `subscriptionsStorage`, `activitiesStorage`, `passwordsStorage`
   - Inicializa con datos de ejemplo automáticamente

2. **src/pages/Subscriptions.jsx**
   - Usa `subscriptionsStorage` en lugar de `subscriptionsAPI`

3. **src/pages/Planner.jsx**
   - Usa `activitiesStorage` en lugar de `activitiesAPI`

4. **src/pages/Vault.jsx**
   - Usa `passwordsStorage` en lugar de `passwordsAPI`

## 🎯 Datos de Ejemplo

La primera vez que abres la app, se crean automáticamente:

### Subscriptions
- Netflix ($15.99/mes)
- Spotify ($9.99/mes)

### Activities
- Reunión de equipo (hoy 10:00)
- Almuerzo (hoy 13:00)

### Passwords
- Ninguna (las creas tú)

## 💾 Dónde se Guardan los Datos

### Android
```
SharedPreferences
/data/data/com.planify.app/shared_prefs/
```

### Web
```
localStorage
Inspeccionar → Application → Local Storage
```

### iOS
```
UserDefaults
Library/Preferences/
```

## 🔐 Seguridad

⚠️ **IMPORTANTE**: Los datos se guardan en texto plano en el dispositivo.

Para producción deberías:
1. Encriptar las contraseñas antes de guardar
2. Usar Capacitor SecureStorage para datos sensibles
3. Implementar autenticación biométrica

## 🚀 Ventajas

✅ **Funciona offline** - No necesita internet
✅ **Más rápido** - No hay latencia de red
✅ **Más simple** - No necesitas servidor
✅ **Privado** - Los datos nunca salen del dispositivo
✅ **Multiplataforma** - Mismo código para web y móvil

## ❌ Desventajas

❌ **No hay sincronización** - Los datos solo están en un dispositivo
❌ **No hay backup automático** - Si desinstalas, pierdes todo
❌ **No hay colaboración** - No puedes compartir con otros usuarios

## 🔄 Exportar/Importar Datos

### Exportar
```javascript
import { storageUtils } from './services/storage';

const data = await storageUtils.exportData();
console.log(JSON.stringify(data, null, 2));
// Guarda este JSON en un archivo
```

### Importar
```javascript
import { storageUtils } from './services/storage';

const data = {
  subscriptions: [...],
  activities: [...],
  passwords: [...]
};

await storageUtils.importData(data);
```

## 🧪 Probar en Android

1. **Build y sync**
```bash
npm run build
npx cap sync android
npx cap open android
```

2. **En Android Studio**
- Build → Rebuild Project
- Run (▶️)

3. **Probar funcionalidad**
- Agregar suscripción ✅
- Agregar actividad ✅
- Agregar contraseña ✅
- Cerrar app y volver a abrir ✅
- Los datos persisten ✅

## 🐛 Solución de Problemas

### Los datos no persisten
```javascript
// Verificar en consola del navegador
import { Preferences } from '@capacitor/preferences';
const { value } = await Preferences.get({ key: 'planify_subscriptions' });
console.log(JSON.parse(value));
```

### Limpiar todos los datos
```javascript
import { storageUtils } from './services/storage';
await storageUtils.clearAll();
```

### Ver datos guardados (Android)
```bash
# En Android Studio → Device File Explorer
/data/data/com.planify.app/shared_prefs/CapacitorStorage.xml
```

## 📱 Ya No Necesitas

❌ Backend (server/index.js)
❌ SQLite (server/database.js)
❌ npm run server
❌ Variables de entorno (VITE_API_URL)

## ✅ Solo Necesitas

✅ npm run dev (para web)
✅ npm run android:build (para Android)

---

¡Ahora la app funciona 100% offline y guarda todo en el dispositivo! 🎉
