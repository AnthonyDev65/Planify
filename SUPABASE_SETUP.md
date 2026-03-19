# 🔧 Configuración de Supabase - Paso a Paso

## ⚠️ IMPORTANTE: Debes completar estos pasos para que la sincronización en la nube funcione

### 1. Verificar Credenciales

Asegúrate de que tu archivo `.env` tenga las credenciales correctas:

```env
VITE_SUPABASE_URL=https://msfgmjdeklksijxycyha.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zZmdtamRla2xrc2lqeHljeWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5OTY2NTYsImV4cCI6MjA4NTU3MjY1Nn0.V8oIEc0lO59XTufVMZDPq7vJpAERDSjKOEPsuFaI6b4
```

### 2. Crear las Tablas en Supabase

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Abre tu proyecto: **msfgmjdeklksijxycyha**
3. En el menú lateral, haz clic en **SQL Editor**
4. Haz clic en **New Query**
5. Copia y pega TODO el contenido del archivo `supabase-schema.sql`
6. Haz clic en **Run** (o presiona Ctrl+Enter)

### 3. Verificar que las Tablas se Crearon

1. En el menú lateral, haz clic en **Table Editor**
2. Deberías ver 3 tablas:
   - ✅ `subscriptions`
   - ✅ `activities`
   - ✅ `passwords`

### 4. Verificar Row Level Security (RLS)

1. En **Table Editor**, selecciona la tabla `subscriptions`
2. Haz clic en el ícono de configuración (⚙️)
3. Verifica que **RLS enabled** esté activado
4. Haz clic en **View Policies**
5. Deberías ver 4 políticas:
   - Users can view their own subscriptions
   - Users can insert their own subscriptions
   - Users can update their own subscriptions
   - Users can delete their own subscriptions

Repite esto para las tablas `activities` y `passwords`.

### 5. Probar la Conexión

#### Opción A: Desde la Consola del Navegador

1. Abre la app en el navegador
2. Abre las DevTools (F12)
3. Ve a la pestaña **Console**
4. Busca mensajes como:
   ```
   isAuthenticated check: true usuario@email.com
   shouldUseSupabase: { online: true, authenticated: true }
   ```

#### Opción B: Crear una Suscripción de Prueba

1. Inicia sesión en la app
2. Ve a **Subscriptions**
3. Haz clic en **Add new**
4. Crea una suscripción de prueba
5. En la consola deberías ver:
   ```
   syncSubscriptions.create - useSupabase: true
   Creating subscription in Supabase for user: [user-id]
   Subscription created in Supabase: [data]
   ```

### 6. Verificar Datos en Supabase

1. Ve a **Table Editor** en Supabase
2. Selecciona la tabla `subscriptions`
3. Deberías ver tu suscripción de prueba con:
   - `id`: UUID generado automáticamente
   - `user_id`: Tu ID de usuario
   - `name`, `price`, `category`, etc.

## 🐛 Solución de Problemas

### Error: "relation 'subscriptions' does not exist"

**Causa**: Las tablas no se han creado en Supabase.

**Solución**: Ejecuta el SQL del archivo `supabase-schema.sql` en el SQL Editor.

---

### Error: "new row violates row-level security policy"

**Causa**: Las políticas RLS no están configuradas correctamente.

**Solución**: 
1. Verifica que ejecutaste TODO el contenido de `supabase-schema.sql`
2. Las políticas RLS deben estar al final del archivo SQL

---

### Los datos no se sincronizan

**Causa**: El usuario no está autenticado o no hay conexión.

**Solución**:
1. Verifica en la consola del navegador los logs:
   - `isAuthenticated check: true`
   - `shouldUseSupabase: { online: true, authenticated: true }`
2. Si `authenticated: false`, cierra sesión y vuelve a iniciar
3. Si `online: false`, verifica tu conexión a internet

---

### Error: "Invalid API key"

**Causa**: Las credenciales en `.env` son incorrectas.

**Solución**:
1. Ve a tu proyecto en Supabase
2. Settings → API
3. Copia la **URL** y **anon/public key**
4. Actualiza el archivo `.env`
5. Reinicia el servidor de desarrollo: `npm run dev`

---

## ✅ Checklist Final

Antes de reportar un problema, verifica:

- [ ] El archivo `.env` tiene las credenciales correctas
- [ ] Ejecutaste el SQL completo de `supabase-schema.sql`
- [ ] Las 3 tablas existen en Supabase (subscriptions, activities, passwords)
- [ ] RLS está habilitado en las 3 tablas
- [ ] Cada tabla tiene 4 políticas (view, insert, update, delete)
- [ ] Iniciaste sesión con un usuario válido
- [ ] La consola del navegador muestra `authenticated: true`
- [ ] Reiniciaste el servidor después de cambiar `.env`

## 📞 Soporte

Si después de seguir todos estos pasos aún tienes problemas:

1. Abre las DevTools (F12)
2. Ve a la pestaña Console
3. Copia todos los mensajes de error
4. Toma una captura de pantalla de la tabla en Supabase
5. Comparte esta información para obtener ayuda
