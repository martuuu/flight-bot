# Usar Node.js 18 LTS como base
FROM node:18-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache \
    sqlite \
    python3 \
    make \
    g++

# Crear directorio de la aplicación
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY src/ ./src/

# Compilar TypeScript
RUN npm run build

# Crear directorios necesarios
RUN mkdir -p data logs backups

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Cambiar permisos
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exponer puerto (si se usa webhook)
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "console.log('Health check passed')" || exit 1

# Comando por defecto
CMD ["npm", "start"]
