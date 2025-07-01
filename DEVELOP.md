# 🔧 Development Branch

Esta es la rama de desarrollo para el Flight Bot.

## 🚀 Configuración Rápida para Desarrollo

```bash
# Cambiar a rama develop
git checkout develop

# Configurar entorno de desarrollo
cp .env.development .env
# Editar .env con tus tokens reales

# Instalar dependencias
npm install

# Inicializar base de datos de desarrollo
npm run db:init

# Ejecutar en modo desarrollo
npm run dev
```

## 🛠️ Flujo de Desarrollo

### Para nuevas funcionalidades:
1. `git checkout develop`
2. `git pull origin develop`
3. `git checkout -b feature/nueva-funcionalidad`
4. Desarrollar funcionalidad
5. `git push origin feature/nueva-funcionalidad`
6. Crear Pull Request hacia `develop`

### Para releases:
1. Merge `develop` → `main`
2. Tag con versión
3. Deploy a producción

## 📊 Scripts de Desarrollo

```bash
# Desarrollo con hot reload
npm run dev

# Tests en modo watch
npm run test:watch

# Linting y formato
npm run lint:fix
npm run format

# Testing específico
npm run test-arajet
npm run demo-complete
```

## 🔍 Debugging

```bash
# Logs en tiempo real
tail -f logs/app-dev.log

# Verificar funcionamiento
npx tsx scripts/verify-bot-functionality.ts

# Limpiar base de datos de desarrollo
rm data/flights-dev.db && npm run db:init
```

## 📝 Notas de Desarrollo

- Use `flights-dev.db` para no afectar datos de producción
- `LOG_LEVEL=debug` para logs detallados
- Rate limiting más permisivo
- Intervalos de scraping más largos

---

**Happy coding! 🚀**
