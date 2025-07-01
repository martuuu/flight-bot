# ✈️ Flight Bot - Alertas de Vuelos Inteligentes

Bot de Telegram que monitorea precios de vuelos y envía alertas automáticas cuando enc## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork del repositorio
2. Crea una rama para tu feature
3. Commit con mensajes descriptivos
4. Push a tu rama
5. Abre un Pull Request

## 📄 Licencia

MIT License - Libre para uso personal y comercial.

---

**¡Felices vuelos! ✈️**coinciden con tus criterios.

## 🎯 ¿Qué hace este bot?

**Flight Bot** es tu asistente personal para encontrar vuelos baratos. Una vez configurado, trabaja 24/7 monitoreando precios y te notifica instantáneamente cuando encuentra ofertas que te interesan.

### ✨ Funcionalidades Principales

- 🤖 **Alertas Automáticas**: Recibe notificaciones en Telegram cuando bajan los precios
- � **Alertas Mensuales**: Analiza todo un mes para encontrar las mejores fechas
- 🌍 **Múltiples Rutas**: Configura alertas para cualquier ruta de vuelo
- � **Control de Precios**: Define tu presupuesto máximo y recibe solo ofertas relevantes
- � **Análisis Inteligente**: Identifica patrones y tendencias de precios
- 🔄 **Monitoreo Continuo**: Funciona las 24 horas, los 7 días de la semana

### � Casos de Uso

- **Vacaciones Familiares**: `"Avísame cuando encuentres vuelos Buenos Aires → Punta Cana por menos de $800"`
- **Viajes de Negocios**: `"Monitorea Santiago → Miami para el próximo mes"`
- **Escapadas de Fin de Semana**: `"Busca ofertas de Bogotá → cualquier destino caribeño"`

## 🚀 Inicio Rápido

### Para Usuarios Finales
👉 **[SETUP.md](SETUP.md)** - Instalación y configuración paso a paso

### Para Desarrolladores  
👉 **[CONFIG.md](CONFIG.md)** - Documentación técnica y configuración avanzada

### Configuración Express (5 minutos)

```bash
git clone https://github.com/martuuu/flight-bot.git
cd flight-bot
./scripts/setup.sh  # Configuración guiada interactiva
```

**Variables Requeridas:**
```bash
TELEGRAM_BOT_TOKEN=tu_token_aqui
ADMIN_CHAT_ID=tu_chat_id
```

## 📱 Comandos Principales

Una vez configurado, el bot responde a estos comandos en Telegram:

### Comandos de Usuario
| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `/start` | Iniciar y registrarse | `/start` |
| `/help` | Ver ayuda completa | `/help` |
| `/monthlyalert` | Crear alerta mensual | `/monthlyalert EZE PUJ 800` |
| `/alert` | Crear alerta específica | `/alert BOG MIA 850000` |
| `/myalerts` | Ver mis alertas activas | `/myalerts` |
| `/stop` | Pausar alerta específica | `/stop 5` |
| `/clearall` | Eliminar todas las alertas | `/clearall` |

### Ejemplos de Uso

```bash
# Alerta mensual - analiza todo el mes para encontrar las mejores ofertas
/monthlyalert SCL PUJ 800

# Alerta específica - monitorea una ruta en tiempo real  
/alert BOG MIA 850000

# Ver mis alertas activas
/myalerts

# Obtener ayuda
/help
```

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Telegram Bot  │────│  Command Handler │────│ Message Formatter│
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Models   │────│   Alert Manager  │────│  Price Monitor  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ SQLite Database │────│ Schedule Manager │────│ Notification Srv│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔧 Tecnologías Utilizadas

- **Runtime**: Node.js 18+ con TypeScript
- **Bot Framework**: node-telegram-bot-api
- **Base de Datos**: SQLite con better-sqlite3
- **Scheduling**: node-cron para tareas automáticas
- **HTTP Client**: axios para llamadas a APIs
- **Logging**: winston para logs estructurados
- **Rate Limiting**: rate-limiter-flexible
- **Testing**: Jest para pruebas unitarias

## 📊 Estado del Proyecto

### ✅ Funcionalidades Completadas
- [x] Bot de Telegram completamente funcional
- [x] Sistema de alertas mensuales con API real de Arajet
- [x] Base de datos SQLite con schema optimizado
- [x] Sistema de monitoreo de precios 24/7
- [x] Logging y manejo de errores robusto
- [x] Rate limiting y protección contra spam
- [x] Scripts de gestión y configuración automática
- [x] Documentación completa

### 🚀 Listo para Producción
El bot está completamente funcional y listo para usar en producción con:
- Análisis automático de precios
- Notificaciones inteligentes
- Gestión de múltiples usuarios
- Monitoreo continuo
- Configuración flexible

## 📚 Documentación

- **[SETUP.md](SETUP.md)** - Guía de instalación y configuración
- **[CONFIG.md](CONFIG.md)** - Documentación técnica detallada
- **[TUTORIAL.md](TUTORIAL.md)** - Tutorial paso a paso para usuarios finales
- **[QUICK_START.md](QUICK_START.md)** - Configuración rápida en 5 minutos

## 📄 Licencia

MIT License - Libre para uso personal y comercial.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork del repositorio
2. Crea una rama para tu feature
3. Commit con mensajes descriptivos
4. Push a tu rama


- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)
- [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3)
- [winston](https://github.com/winstonjs/winston)

---

**¡Felices viajes! ✈️**

Para soporte adicional, contacta al equipo de desarrollo o abre un issue en GitHub.
