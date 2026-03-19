# 🚀 Despliegue Rápido en Dokploy

## Resumen de Configuración

Tu proyecto Planify ya está listo para desplegarse en Dokploy con los siguientes archivos:

✅ `Dockerfile` - Configuración de contenedor multi-stage
✅ `.dockerignore` - Archivos excluidos del build
✅ `dokploy.json` - Configuración de Dokploy (opcional)
✅ `docker-compose.yml` - Para pruebas locales

## 🎯 Pasos Rápidos

### 1. Probar Localmente (Opcional)

```bash
# Construir y ejecutar con Docker
docker-compose up --build

# Acceder a: http://localhost:3001
```

### 2. Subir a Git

```bash
git add .
git commit -m "Configuración para Dokploy"
git push origin main
```

### 3. Configurar en Dokploy

1. **Crear Nueva Aplicación**
   - Tipo: Git
   - Repositorio: Tu URL de Git
   - Branch: main

2. **Configuración de Build**
   - Build Type: Dockerfile
   - Dockerfile Path: `./Dockerfile`
   - Port: `3001`

3. **Variables de Entorno** (Importante)
   ```env
   NODE_ENV=production
   PORT=3001
   VITE_API_URL=https://TU-DOMINIO.com/api
   ```

4. **Volumen Persistente** (Para la base de datos)
   - Host: `/var/lib/dokploy/planify/data`
   - Container: `/app/data`

5. **Deploy** 🚀

## 🔍 Verificación

Después del despliegue, verifica:

- ✅ Health check: `https://tu-dominio.com/api/health`
- ✅ Frontend: `https://tu-dominio.com`
- ✅ Logs en Dokploy (sin errores)

## ⚡ Características

- **Multi-stage build**: Optimizado para producción
- **Frontend + Backend**: Todo en un contenedor
- **Base de datos persistente**: SQLite con volumen
- **Health checks**: Monitoreo automático
- **SSL automático**: Configurado por Dokploy

## 📝 Notas Importantes

1. **VITE_API_URL**: Debe apuntar a tu dominio de Dokploy
2. **Volumen**: Esencial para no perder datos
3. **Puerto**: Debe ser 3001 (configurado en el Dockerfile)

## 🆘 Problemas Comunes

**Error: Cannot connect to API**
→ Verifica que `VITE_API_URL` esté correctamente configurado

**Error: Database locked**
→ Asegúrate de que el volumen esté montado correctamente

**Error: Build failed**
→ Revisa los logs de build en Dokploy

---

Para más detalles, consulta `DEPLOY.md`
