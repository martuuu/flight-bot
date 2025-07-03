# Deployment y Backup - Aerolíneas Token Management

## 📍 Opciones de Deployment

### 1. Vercel (Recomendado para el monitor de tokens)
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy el monitor como función serverless
vercel --prod

# Configurar cron job en vercel.json
{
  "crons": [
    {
      "path": "/api/monitor-token",
      "schedule": "0 */12 * * *"
    }
  ]
}
```

**Ventajas**:
- ✅ Ejecución automática cada 12 horas
- ✅ Sin servidor que mantener
- ✅ Logs automáticos
- ✅ Notificaciones por email en caso de error

### 2. GitHub Actions (Alternativa gratuita)
```yaml
# .github/workflows/monitor-token.yml
name: Monitor Aerolineas Token
on:
  schedule:
    - cron: '0 */12 * * *'  # Cada 12 horas

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx ts-node scripts/monitor-token.ts
      - name: Commit token changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A
          git diff --staged --quiet || git commit -m "Auto-update Aerolineas token"
          git push
```

**Ventajas**:
- ✅ Completamente gratuito
- ✅ Se ejecuta en GitHub
- ✅ Actualiza automáticamente el repo
- ✅ Historial completo en Git

### 3. VPS/Servidor con Cron (Máximo control)
```bash
# Configurar cron job en el servidor
crontab -e

# Agregar línea para ejecución cada 12 horas
0 */12 * * * cd /path/to/flight-bot && npx ts-node scripts/monitor-token.ts >> /var/log/token-monitor.log 2>&1
```

## 💾 Storage del Token

### Opción 1: En el repositorio (Actual)
```
/Users/martinnavarro/Documents/flight-bot/
├── src/services/AerolineasAlertService.ts  # Token hardcodeado aquí
├── data/token-backup.json                  # Backup del token con metadata
└── logs/token-monitor.log                  # Logs del monitoreo
```

**Pros**: Simple, versionado en Git  
**Contras**: Token visible en el código

### Opción 2: Variables de entorno
```bash
# .env
AEROLINEAS_TOKEN=eyJhbGciOiJSUzI1NiIs...
AEROLINEAS_TOKEN_EXPIRY=2025-07-04T18:31:40.677Z

# En el código
private fallbackToken: string = process.env.AEROLINEAS_TOKEN || 'fallback_token';
```

**Pros**: Más seguro, no está en el código  
**Contras**: Requiere actualización manual en el deployment

### Opción 3: Base de datos/Storage externo
```typescript
// Guardar en base de datos
await db.settings.upsert({
  where: { key: 'aerolineas_token' },
  update: { value: newToken, updatedAt: new Date() },
  create: { key: 'aerolineas_token', value: newToken }
});
```

**Pros**: Centralizado, auditable  
**Contras**: Dependencia adicional

## 🔄 Estrategia Recomendada

### Setup Inicial
1. **GitHub Actions** para monitoreo automático
2. **Token en variable de entorno** para mayor seguridad
3. **Backup en base de datos** para historial

### Configuración Paso a Paso

1. **Crear GitHub Action**:
```bash
mkdir -p .github/workflows
# Copiar el archivo monitor-token.yml
```

2. **Configurar secrets en GitHub**:
```bash
# En GitHub repo settings > Secrets and variables > Actions
AEROLINEAS_TOKEN=tu_token_actual
```

3. **Actualizar el servicio**:
```typescript
private fallbackToken: string = process.env.AEROLINEAS_TOKEN || 
  'eyJhbGciOiJSUzI1NiIs...'; // fallback hardcodeado
```

4. **Configurar notificaciones**:
```typescript
// En el monitor, agregar notificación por webhook/email
await fetch('https://hooks.slack.com/...', {
  method: 'POST',
  body: JSON.stringify({
    text: `🔑 Aerolíneas token updated automatically`
  })
});
```

## 📊 Monitoreo y Alertas

### Dashboard Simple (Opcional)
```typescript
// /api/token-status endpoint
export default async function handler(req, res) {
  const service = new AerolineasAlertService();
  const status = service.getTokenStatus();
  
  res.json({
    isValid: status.isValid,
    expiresAt: status.expiresAt,
    hoursUntilExpiry: status.timeUntilExpiry / 3600,
    lastChecked: new Date().toISOString()
  });
}
```

### Alertas Proactivas
```bash
# Notificar cuando quedan menos de 24 horas
if (hoursUntilExpiry < 24) {
  sendAlert('Token expires in less than 24 hours!');
}
```

## 🎯 Recomendación Final

**Para tu caso específico, recomiendo**:

1. **GitHub Actions** (gratuito, automático)
2. **Token en variables de entorno** (más seguro)
3. **Backup en data/token-backup.json** (simple, efectivo)
4. **Notificaciones por Telegram** (usando tu bot existente)

Esto te da:
- ✅ Monitoreo automático cada 12 horas
- ✅ Sin costos adicionales
- ✅ Historial completo en Git
- ✅ Notificaciones inmediatas
- ✅ Fallback robusto si algo falla
