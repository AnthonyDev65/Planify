# Dockerfile para Planify - Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias de compilación para better-sqlite3
RUN apk add --no-cache python3 make g++

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build del frontend
RUN npm run build

# Etapa de producción
FROM node:20-alpine

WORKDIR /app

# Instalar dependencias de compilación para better-sqlite3
RUN apk add --no-cache python3 make g++

# Instalar solo dependencias de producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar el build del frontend
COPY --from=builder /app/dist ./dist

# Copiar el servidor
COPY server ./server

# Copiar script de inicio
COPY start.sh ./start.sh
RUN chmod +x start.sh

# Crear directorio para la base de datos
RUN mkdir -p /app/data

# Exponer puerto
EXPOSE 3001

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3001

# Comando de inicio
CMD ["./start.sh"]
