# Guía de Despliegue en Dokploy

## 📋 Requisitos Previos

- Cuenta en Dokploy
- Repositorio Git con el código del proyecto
- Variables de entorno configuradas

## 🚀 Pasos para Desplegar

### 1. Preparar el Repositorio

Asegúrate de que todos los archivos de configuración estén en tu repositorio:
- `Dockerfile`
- `.dockerignore`
- `dokploy.json` (opcional)

### 2. Crear Aplicación en Dokploy

1. Accede a tu panel de Dokploy
2. Crea un nuevo proyecto o selecciona uno existente
3. Haz clic en "New Application"
4. Selecciona "Git" como fuente

### 3. Configurar la Aplicación

**Configuración Básica:**
- **Name:** planify
- **Repository:** URL de tu repositorio Git
- **Branch:** main (o la rama que uses)
- **Build Type:** Dockerfile
- **Dockerfile Path:** ./Dockerfile

**Puerto:**
- **Port:** 3001

### 4. Variables de Entorno

Configura las siguientes variables de entorno en Dokploy:

```env
NODE_ENV=production
PORT=3001
VITE_API_URL=https://tu-dominio.com/api
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

**Importante:** Reemplaza `tu-dominio.com` con tu dominio real de Dokploy.

### 5. Configurar Volumen Persistente

Para mantener la base de datos SQLite entre reinicios:

1. En la configuración de la aplicación, ve a "Volumes"
2. Agrega un nuevo volumen:
   - **Host Path:** `/var/lib/dokploy/planify/data`
   - **Container Path:** `/app/data`

### 6. Health Check (Opcional)

Configura el health check para monitorear la aplicación:
- **Path:** `/api/health`
- **Interval:** 30 segundos
- **Timeout:** 10 segundos
- **Retries:** 3

### 7. Desplegar

1. Haz clic en "Deploy"
2. Espera a que el build se complete
3. Verifica los logs para asegurarte de que todo funciona correctamente

## 🔧 Configuración del Dominio

1. En Dokploy, ve a la sección "Domains"
2. Agrega tu dominio personalizado o usa el subdominio proporcionado
3. Dokploy configurará automáticamente SSL con Let's Encrypt

## 📊 Verificar el Despliegue

Una vez desplegado, verifica que todo funciona:

1. Accede a `https://tu-dominio.com/api/health`
   - Deberías ver: `{"status":"ok","message":"Planify API is running"}`

2. Accede a `https://tu-dominio.com`
   - Deberías ver la aplicación frontend

## 🔄 Actualizaciones

Para actualizar la aplicación:

1. Haz push de tus cambios al repositorio Git
2. En Dokploy, haz clic en "Redeploy"
3. O configura auto-deploy para que se actualice automáticamente con cada push

## 🐛 Troubleshooting

### La aplicación no inicia
- Verifica los logs en Dokploy
- Asegúrate de que todas las variables de entorno estén configuradas
- Verifica que el puerto 3001 esté correctamente expuesto

### La base de datos se pierde al reiniciar
- Verifica que el volumen persistente esté correctamente configurado
- Asegúrate de que la ruta `/app/data` tenga permisos de escritura

### El frontend no carga
- Verifica que `VITE_API_URL` apunte a tu dominio correcto
- Asegúrate de que el build de Vite se completó correctamente
- Revisa los logs del servidor

### Errores de CORS
- Verifica que el frontend esté accediendo a la API usando el mismo dominio
- En producción, el servidor sirve tanto el frontend como la API

## 📝 Notas Adicionales

- La aplicación usa SQLite, que es adecuado para aplicaciones pequeñas/medianas
- Para mayor escalabilidad, considera migrar a PostgreSQL o MySQL
- Los datos se almacenan en `/app/data/planify.db` dentro del contenedor
- El volumen persistente asegura que los datos no se pierdan

## 🔐 Seguridad

- Asegúrate de que las variables de entorno sensibles estén configuradas como secretos
- Usa HTTPS (Dokploy lo configura automáticamente)
- Considera implementar autenticación si la aplicación maneja datos sensibles

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs en Dokploy
2. Verifica la documentación de Dokploy
3. Revisa los issues del repositorio
