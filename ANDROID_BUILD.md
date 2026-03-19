# 📱 Guía para Generar APK de Android

## Requisitos Previos

1. **Android Studio** instalado
   - Descarga desde: https://developer.android.com/studio
   - Instala Android SDK y herramientas de compilación

2. **Java JDK 17** o superior
   - Verifica con: `java -version`

3. **Variables de entorno configuradas**:
   ```bash
   ANDROID_HOME=C:\Users\TuUsuario\AppData\Local\Android\Sdk
   JAVA_HOME=C:\Program Files\Java\jdk-17
   ```

## Pasos para Generar la App

### 1. Build del Proyecto Web

```bash
npm run build
```

Esto genera la carpeta `dist/` con los archivos optimizados.

### 2. Sincronizar con Android

```bash
npm run android:build
```

O manualmente:
```bash
npx cap sync android
```

### 3. Abrir en Android Studio

```bash
npm run android:open
```

O manualmente:
```bash
npx cap open android
```

### 4. Generar APK en Android Studio

1. En Android Studio, ve a **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Espera a que termine la compilación
3. El APK se generará en: `android/app/build/outputs/apk/debug/app-debug.apk`

### 5. Generar APK Firmado (Release)

1. En Android Studio, ve a **Build → Generate Signed Bundle / APK**
2. Selecciona **APK**
3. Crea o selecciona un keystore
4. Completa la información de firma
5. Selecciona **release** como build variant
6. El APK firmado se generará en: `android/app/build/outputs/apk/release/`

## Comandos Útiles

```bash
# Build y sincronizar
npm run android:build

# Abrir Android Studio
npm run android:open

# Build, sincronizar y ejecutar en dispositivo
npm run android:run

# Solo sincronizar cambios
npx cap sync android

# Ver logs en tiempo real
npx cap run android -l
```

## Configuración del Proyecto Android

### Permisos (android/app/src/main/AndroidManifest.xml)

Los siguientes permisos ya están configurados:
- Internet
- Notificaciones Push
- Acceso a red

### Iconos y Splash Screen

Para personalizar iconos:
1. Coloca tus iconos en `android/app/src/main/res/`
2. Usa Android Studio → Image Asset para generar todos los tamaños

Para personalizar splash screen:
1. Edita `android/app/src/main/res/values/styles.xml`
2. Configura el color de fondo en `capacitor.config.json`

## Configuración de Notificaciones Push

### Firebase Cloud Messaging (FCM)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Agrega una app Android con el package name: `com.planify.app`
4. Descarga `google-services.json`
5. Colócalo en `android/app/`
6. Agrega el plugin de Firebase en `android/build.gradle`:

```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.15'
    }
}
```

7. En `android/app/build.gradle` agrega al final:

```gradle
apply plugin: 'com.google.gms.google-services'
```

## Probar en Dispositivo Físico

1. Habilita **Opciones de Desarrollador** en tu Android
2. Activa **Depuración USB**
3. Conecta el dispositivo por USB
4. Ejecuta:

```bash
npm run android:run
```

## Probar en Emulador

1. Abre Android Studio
2. Ve a **Tools → Device Manager**
3. Crea un nuevo dispositivo virtual (AVD)
4. Inicia el emulador
5. Ejecuta:

```bash
npm run android:run
```

## Solución de Problemas

### Error: SDK not found

Configura la variable de entorno `ANDROID_HOME`:
```bash
# Windows
setx ANDROID_HOME "C:\Users\TuUsuario\AppData\Local\Android\Sdk"

# Linux/Mac
export ANDROID_HOME=$HOME/Android/Sdk
```

### Error: Java version

Asegúrate de tener JDK 17:
```bash
java -version
```

### Error: Gradle build failed

Limpia el proyecto:
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### La app no se conecta al backend

En desarrollo, usa la IP de tu computadora en lugar de localhost:
1. Encuentra tu IP local: `ipconfig` (Windows) o `ifconfig` (Linux/Mac)
2. Actualiza `.env`:
   ```
   VITE_API_URL=http://TU_IP:3001/api
   ```
3. Rebuild: `npm run android:build`

## Publicar en Google Play Store

1. Genera un APK firmado (release)
2. Crea una cuenta de desarrollador en [Google Play Console](https://play.google.com/console)
3. Crea una nueva aplicación
4. Completa la información requerida
5. Sube el APK o AAB
6. Completa el proceso de revisión

## Recursos Adicionales

- [Documentación de Capacitor](https://capacitorjs.com/docs)
- [Guía de Android](https://capacitorjs.com/docs/android)
- [Configuración de Plugins](https://capacitorjs.com/docs/plugins)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)

---

¿Necesitas ayuda? Consulta la documentación oficial o abre un issue en GitHub.
