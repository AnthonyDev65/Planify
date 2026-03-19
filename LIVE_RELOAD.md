# 🔥 Live Reload en Android - Ver Cambios en Tiempo Real

## Método 1: Capacitor Live Reload (Recomendado)

Este método te permite ver los cambios instantáneamente en tu dispositivo Android mientras programas.

### Paso 1: Obtener tu IP Local

**Windows:**
```bash
ipconfig
```
Busca `IPv4 Address` en tu adaptador de red (ejemplo: `192.168.1.100`)

**Linux/Mac:**
```bash
ifconfig
# o
ip addr show
```

### Paso 2: Configurar Capacitor para Live Reload

Actualiza `capacitor.config.json`:

```json
{
  "appId": "com.planify.app",
  "appName": "Planify",
  "webDir": "dist",
  "server": {
    "url": "http://TU_IP_LOCAL:5173",
    "cleartext": true,
    "androidScheme": "http"
  }
}
```

**Ejemplo con IP real:**
```json
{
  "server": {
    "url": "http://192.168.1.100:5173",
    "cleartext": true,
    "androidScheme": "http"
  }
}
```

### Paso 3: Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

Verás algo como:
```
VITE v7.3.1  ready in 243 ms
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/
```

### Paso 4: Sincronizar y Ejecutar

```bash
npx cap sync android
npx cap run android
```

### Paso 5: ¡Listo! 🎉

Ahora cada vez que guardes un archivo:
1. Vite recargará automáticamente
2. La app en tu Android se actualizará instantáneamente
3. Verás los cambios en 1-2 segundos

### Importante ⚠️

- Tu computadora y Android deben estar en la **misma red WiFi**
- El firewall de Windows debe permitir conexiones en el puerto 5173
- Cuando termines de desarrollar, **revierte** el `capacitor.config.json` a su estado original

### Revertir Configuración (Para Build de Producción)

Cuando termines de desarrollar, vuelve a:

```json
{
  "server": {
    "androidScheme": "https",
    "cleartext": true
  }
}
```

Y haz un build normal:
```bash
npm run android:build
```

---

## Método 2: Ionic CLI con Live Reload

### Instalar Ionic CLI

```bash
npm install -g @ionic/cli
```

### Ejecutar con Live Reload

```bash
ionic cap run android -l --external
```

Esto:
1. Inicia el servidor de desarrollo
2. Detecta tu IP automáticamente
3. Configura Capacitor
4. Ejecuta la app en Android
5. Habilita live reload

### Ventajas del Método 2:
- Configuración automática
- No necesitas cambiar archivos manualmente
- Detecta tu IP automáticamente

---

## Método 3: Usar Navegador del Dispositivo (Más Simple)

Si solo quieres probar rápido sin instalar:

### Paso 1: Iniciar servidor

```bash
npm run dev -- --host
```

### Paso 2: Abrir en el navegador del Android

En tu dispositivo Android, abre Chrome y ve a:
```
http://TU_IP_LOCAL:5173
```

Ejemplo: `http://192.168.1.100:5173`

### Ventajas:
- No necesitas Android Studio
- Cambios instantáneos
- Más rápido para probar

### Desventajas:
- No prueba funcionalidades nativas (Capacitor plugins)
- No es la app real

---

## Configurar Firewall de Windows

Si no puedes conectarte desde Android:

### Paso 1: Abrir Firewall

1. Busca "Firewall de Windows Defender"
2. Click en "Configuración avanzada"
3. Click en "Reglas de entrada"
4. Click en "Nueva regla..."

### Paso 2: Crear Regla

1. Tipo: **Puerto**
2. Protocolo: **TCP**
3. Puerto: **5173**
4. Acción: **Permitir la conexión**
5. Perfil: Marca todos
6. Nombre: **Vite Dev Server**

---

## Scripts Útiles para package.json

Agrega estos scripts para facilitar el desarrollo:

```json
{
  "scripts": {
    "dev:host": "vite --host",
    "android:dev": "ionic cap run android -l --external",
    "android:live": "npm run dev:host"
  }
}
```

Uso:
```bash
# Método simple (navegador)
npm run dev:host

# Método con Ionic (recomendado)
npm run android:dev
```

---

## Solución de Problemas

### No puedo conectarme desde Android

1. **Verifica la IP:**
   ```bash
   ipconfig
   ```

2. **Verifica que el servidor esté corriendo:**
   ```bash
   npm run dev -- --host
   ```

3. **Prueba hacer ping desde Android:**
   - Instala "Network Utilities" desde Play Store
   - Haz ping a tu IP

4. **Desactiva temporalmente el firewall:**
   - Solo para probar
   - Luego configúralo correctamente

### La app no se actualiza automáticamente

1. **Verifica la configuración de capacitor.config.json**
2. **Reinicia el servidor de desarrollo**
3. **Cierra y abre la app en Android**

### Error: ERR_CLEARTEXT_NOT_PERMITTED

Asegúrate de tener en `capacitor.config.json`:
```json
{
  "server": {
    "cleartext": true
  }
}
```

Y en `android/app/src/main/AndroidManifest.xml`:
```xml
<application
    android:usesCleartextTraffic="true"
    ...>
```

---

## Workflow Recomendado

### Durante Desarrollo:

1. **Mañana:**
   ```bash
   # Terminal 1: Backend
   npm run server
   
   # Terminal 2: Frontend con live reload
   npm run dev -- --host
   
   # Terminal 3: Ejecutar en Android
   npx cap run android
   ```

2. **Programa normalmente** en tu editor
3. **Guarda archivos** (Ctrl+S)
4. **Ve los cambios** instantáneamente en tu Android

### Antes de Cerrar:

1. **Revierte capacitor.config.json** si lo modificaste
2. **Commit tus cambios** a Git
3. **Cierra los servidores** (Ctrl+C)

---

## Tips Pro 💡

1. **Usa dos monitores:**
   - Monitor 1: Editor de código
   - Monitor 2: Android Studio con Logcat

2. **Mantén Logcat abierto:**
   - Ver errores en tiempo real
   - Filtrar por "Planify" o "Capacitor"

3. **Hot Module Replacement (HMR):**
   - Vite ya lo tiene activado
   - Los cambios se aplican sin recargar la página completa

4. **React DevTools:**
   - Instala en Chrome
   - Úsalo para debuggear componentes

5. **Atajos útiles:**
   - `Ctrl+S`: Guardar y ver cambios
   - `Ctrl+Shift+R`: Recargar app manualmente
   - `Ctrl+C`: Detener servidor

---

## Ejemplo Completo

```bash
# 1. Obtener IP
ipconfig
# Resultado: 192.168.1.100

# 2. Editar capacitor.config.json
# Agregar: "url": "http://192.168.1.100:5173"

# 3. Iniciar desarrollo
npm run dev -- --host

# 4. En otra terminal
npx cap sync android
npx cap run android

# 5. ¡Programa y ve los cambios en tiempo real! 🚀
```

---

¿Necesitas ayuda? Revisa los logs en Logcat o consulta la documentación de Capacitor.
