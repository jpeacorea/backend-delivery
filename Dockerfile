# =====================================
# Build Stage
# =====================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Instalar pnpm e instalar dependencias
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# =====================================
# Production Stage
# =====================================
FROM node:20-alpine AS production

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copiar dependencias desde stage de build
COPY --from=builder /app/node_modules ./node_modules

# Copiar código fuente de la aplicación
COPY --chown=nodejs:nodejs . .

# Crear directorio para uploads
RUN mkdir -p /app/uploads && chown nodejs:nodejs /app/uploads

# Cambiar a usuario no-root
USER nodejs

# Exponer el puerto de la aplicación
EXPOSE 7847

# Variables de entorno por defecto
ENV NODE_ENV=production \
    PORT=7847 \
    HOSTNAME=0.0.0.0

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:7847/api-docs || exit 1

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
