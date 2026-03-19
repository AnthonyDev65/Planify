# 🔧 Solución: App Android se ve blanca

## Problema
La app se abre pero muestra una pantalla completamente blanca.

## Solución Paso a Paso

### 1. Limpiar y Rebuild

En tu terminal:

```bash
# 1. Build del proyecto web
npm run build

# 2. Sincronizar con Android
npx cap sync android

# 3. Abrir Android Studio
npx cap open android
```

### 2. En Android Studio

1. **Clean Project**:
   - Ve a `Build` → `Clean Project`
   - Espera a que termine

2. **Invalidate Caches**:
   - Ve a `File` → `Invalidate Caches / Restart`
   - Selecciona `Invalidate and Restart`

3. **Rebuild Project**:
   - Ve a `Build` → `Rebuild Project`
   - Espera a que termine (puede tomar varios minutos)

4. **Run App**:
   - Conecta tu dispositivo o inicia el emulador
   - Haz clic en el botón verde de Play (▶️)

### 3. Verificar en el Dispositivo

Si la app sigue en blanco:

1. **Desinstala la app** del dispositivo completamente
2. **Vuelve a instalar** desde Android Studio

### 4. Ver Logs (Logcat)

En Android Studio:

1. Ve a `View` → `Tool Windows` → `Logcat`
2. Busca errores en rojo
3. Filtra por `Planify` o `Capacitor`

Errores comunes:
- `ERR_CLEARTEXT_NOT_PERMITTED` → Problema de HTTP/HTTPS
- `Failed to load resource` → Archivos no encontrados
- `JavaScript error` → Error en el código

### 5. Verificar Configuración

Verifica que estos archivos existan:

```
android/app/src/main/assets/public/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── vendor-[hash].js
└── capacitor.config.json
```

Si faltan archivos, ejecuta:
```bash
npm run android:build
```

### 6. Probar en Navegador Primero

Antes de probar en Android, verifica que funcione en el navegador:

```bash
npm run dev
```

Abre http://localhost:5173 y verifica que todo funcione.

### 7. Configuración de Red (Si usas API)

Si tu app necesita conectarse a un backend local:

1. Encuentra tu IP local:
   ```bash
   ipconfig  # Windows
   ifconfig  # Linux/Mac
   ```

2. Actualiza `.env`:
   ```
   VITE_API_URL=http://TU_IP_LOCAL:3001/api
   ```

3. Rebuild:
   ```bash
   npm run android:build
   ```

### 8. Verificar AndroidManifest.xml

Abre `android/app/src/main/AndroidManifest.xml` y verifica que tenga:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<application
    android:usesCleartextTraffic="true"
    ...>
```

### 9. Verificar capacitor.config.json

Debe tener:

```json
{
  "server": {
    "androidScheme": "https",
    "cleartext": true
  },
  "android": {
    "allowMixedContent": true
  }
}
```

### 10. Último Recurso

Si nada funciona:

```bash
# 1. Eliminar carpeta android
rm -rf android

# 2. Volver a agregar Android
npm run build
npx cap add android

# 3. Abrir en Android Studio
npx cap open android
```

## Comandos Útiles

```bash
# Ver logs en tiempo real
npx cap run android -l

# Build y ejecutar
npm run android:run

# Solo sincronizar
npx cap sync android

# Copiar assets
npx cap copy android
```

## Verificar que la App Funciona

La app debería mostrar:
- Fondo oscuro (#0a0a0f)
- Header con buscador
- Navegación inferior con 4 iconos
- Contenido de la página Home

Si ves esto, ¡la app está funcionando correctamente! 🎉

## Contacto

Si el problema persiste, revisa los logs de Logcat y busca el error específico.
