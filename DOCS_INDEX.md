# 📚 Documentación del Flight Bot

Este proyecto incluye documentación organizada para diferentes tipos de usuarios y casos de uso.

## 📋 Archivos de Documentación

### 🚀 Para Usuarios Finales
- **[README.md](README.md)** - Descripción general y características del bot
- **[SETUP.md](SETUP.md)** - Instalación y configuración paso a paso
- **[QUICK_START.md](QUICK_START.md)** - Configuración rápida en 5 minutos
- **[TUTORIAL.md](TUTORIAL.md)** - Tutorial detallado para usuarios no técnicos

### 🔧 Para Desarrolladores
- **[CONFIG.md](CONFIG.md)** - Documentación técnica detallada y arquitectura
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guía de despliegue en producción
- **[SECURITY.md](SECURITY.md)** - Consideraciones de seguridad

### 📖 Documentación Específica
- **[MONTHLY_ALERTS_GUIDE.md](MONTHLY_ALERTS_GUIDE.md)** - Guía detallada de alertas mensuales
- **[API_KEYS_GUIDE.md](API_KEYS_GUIDE.md)** - Cómo obtener APIs de aerolíneas
- **[ARAJET_SCRAPING_GUIDE.md](ARAJET_SCRAPING_GUIDE.md)** - Integración con Arajet

### 📊 Documentación de Estado
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Estado actual del proyecto
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Resumen de implementación
- **[FINAL_PROJECT_SUMMARY.md](FINAL_PROJECT_SUMMARY.md)** - Análisis final completado

## 🎯 ¿Qué documentación usar?

### Si eres nuevo en el proyecto:
1. **Empieza aquí**: [README.md](README.md) - Entiende qué hace el bot
2. **Instalación**: [SETUP.md](SETUP.md) - Configuración completa paso a paso
3. **Configuración rápida**: [QUICK_START.md](QUICK_START.md) - Si tienes prisa

### Si eres usuario final (no técnico):
1. **Tutorial completo**: [TUTORIAL.md](TUTORIAL.md) - Explicación detallada
2. **Configuración rápida**: [QUICK_START.md](QUICK_START.md) - Versión express

### Si eres desarrollador:
1. **Documentación técnica**: [CONFIG.md](CONFIG.md) - Arquitectura y componentes
2. **Instalación**: [SETUP.md](SETUP.md) - Setup técnico detallado
3. **Despliegue**: [DEPLOYMENT.md](DEPLOYMENT.md) - Producción y Docker

### Si quieres entender las alertas mensuales:
1. **Guía específica**: [MONTHLY_ALERTS_GUIDE.md](MONTHLY_ALERTS_GUIDE.md)
2. **Documentación técnica**: [CONFIG.md](CONFIG.md)

## 🚀 Flujo Recomendado para Nuevos Usuarios

### Configuración Inicial
1. **Leer funcionalidades**: [README.md](README.md)
2. **Instalación completa**: [SETUP.md](SETUP.md)
3. **Verificar funcionamiento**: Envía `/start` a tu bot

### Uso del Bot
1. **Crear primera alerta**: `/monthlyalert EZE PUJ 800`
2. **Ver alertas activas**: `/myalerts`
3. **Obtener ayuda**: `/help`

### Si hay problemas
1. **Revisar logs**: `./scripts/bot-manager.sh logs`
2. **Verificar estado**: `./scripts/bot-manager.sh status`
3. **Reiniciar**: `./scripts/bot-manager.sh restart`

## 🛠️ Scripts y Comandos Esenciales

### Gestión del Bot
```bash
# Configurar por primera vez
./scripts/setup.sh

# Gestionar el bot
./scripts/bot-manager.sh status   # Ver estado
./scripts/bot-manager.sh start    # Iniciar
./scripts/bot-manager.sh restart  # Reiniciar
./scripts/bot-manager.sh logs     # Ver logs

# Verificar funcionamiento
npx tsx scripts/verify-bot-functionality.ts
```

### Comandos del Bot en Telegram
```bash
/start                           # Iniciar bot
/help                           # Ver ayuda
/monthlyalert EZE PUJ 800       # Crear alerta mensual
/myalerts                       # Ver mis alertas
/stop ID                        # Pausar alerta específica
/clearall                       # Eliminar todas las alertas
```

## 📊 Documentación por Categoría

### Instalación y Configuración
| Archivo | Audiencia | Descripción |
|---------|-----------|-------------|
| [SETUP.md](SETUP.md) | Técnica | Instalación paso a paso |
| [QUICK_START.md](QUICK_START.md) | General | Configuración rápida |
| [TUTORIAL.md](TUTORIAL.md) | No técnica | Tutorial detallado |

### Funcionamiento y Uso
| Archivo | Audiencia | Descripción |
|---------|-----------|-------------|
| [README.md](README.md) | General | Descripción del proyecto |
| [MONTHLY_ALERTS_GUIDE.md](MONTHLY_ALERTS_GUIDE.md) | Usuario | Guía de alertas mensuales |

### Desarrollo y Técnica
| Archivo | Audiencia | Descripción |
|---------|-----------|-------------|
| [CONFIG.md](CONFIG.md) | Desarrollador | Documentación técnica |
| [DEPLOYMENT.md](DEPLOYMENT.md) | DevOps | Despliegue en producción |
| [SECURITY.md](SECURITY.md) | Técnica | Seguridad y vulnerabilidades |

### APIs y Integraciones
| Archivo | Audiencia | Descripción |
|---------|-----------|-------------|
| [API_KEYS_GUIDE.md](API_KEYS_GUIDE.md) | Desarrollador | Obtener APIs de aerolíneas |
| [ARAJET_SCRAPING_GUIDE.md](ARAJET_SCRAPING_GUIDE.md) | Técnica | Integración con Arajet |

## 🎉 Documentación del Proyecto Completado

### Estado y Progreso
- [PROJECT_STATUS.md](PROJECT_STATUS.md) - Estado actual completo
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Resumen de implementación
- [FINAL_PROJECT_SUMMARY.md](FINAL_PROJECT_SUMMARY.md) - Análisis final

### Funcionamiento Verificado
- ✅ Bot de Telegram 100% funcional
- ✅ Sistema de alertas mensuales con API real de Arajet
- ✅ Base de datos SQLite optimizada
- ✅ Monitoreo automático 24/7
- ✅ Scripts de gestión y configuración
- ✅ Documentación completa

## 📞 Necesitas Ayuda?

### Problemas Comunes
1. **Bot no responde**: `./scripts/bot-manager.sh restart`
2. **Errores de configuración**: Revisar [SETUP.md](SETUP.md)
3. **Dudas sobre uso**: Ver [TUTORIAL.md](TUTORIAL.md)
4. **Problemas técnicos**: Consultar [CONFIG.md](CONFIG.md)

### Verificación del Sistema
```bash
# Comando todo-en-uno para verificar que funciona
npx tsx scripts/verify-bot-functionality.ts

# Ver estado detallado
./scripts/bot-manager.sh status
```

---

**¡Tu bot está listo para encontrar vuelos baratos 24/7! ✈️**
1. **Configurar el bot fácilmente** (sin conocimientos técnicos)
2. **Gestionarlo de forma segura** (evitando problemas comunes)
3. **Usarlo eficientemente** (comandos claros y ejemplos)
4. **Solucionar problemas** (guías de troubleshooting)

**¡Perfecto para compartir con amigos y familia! 👥✈️**
