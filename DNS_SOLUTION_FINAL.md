# 🔧 Solución DNS: Configuración Clara y Definitiva

## 🎯 Problema Identificado
Tienes configuración DNS en AMBOS lados (Hostinger + Vercel) causando conflictos.

## ✅ Solución Recomendada: Usar DNS de Vercel

### Paso 1: Cambiar Nameservers en Hostinger

**En Hostinger (Administrar dominio):**

1. Ve a **DNS / Nameservers** → **Nameservers**
2. Haz clic en **"Cambiar nameservers"**
3. Cambia de:
   ```
   ns1.dns-parking.com  →  ns1.vercel-dns.com
   ns2.dns-parking.com  →  ns2.vercel-dns.com
   ```

4. **Guarda los cambios**

### Paso 2: Limpiar registros DNS en Hostinger

**En la sección "Administrar registros DNS":**

1. **ELIMINA TODOS** los registros existentes:
   - ❌ CNAME www → cname.vercel-dns.com
   - ❌ A @ → 76.76.19.61
   - ❌ Cualquier otro registro que hayas creado

2. **Deja la sección vacía** - Vercel se encargará de todo

### Paso 3: Verificar configuración en Vercel

**Ya tienes esto configurado correctamente:**
- ✅ Dominio: flight-bot.com agregado
- ✅ Variables de entorno configuradas
- ✅ Deployment funcionando

## 🕒 Tiempo de propagación:
- **24-48 horas** para nameservers (puede ser más rápido)
- **5-10 minutos** después de que los nameservers se propaguen

## 🧪 Verificación paso a paso:

### Inmediatamente después del cambio:
```bash
# Verificar nameservers (puede tardar unas horas)
nslookup -type=ns flight-bot.com
```

### Cuando se hayan propagado los nameservers:
```bash
# Verificar que resuelve a Vercel
nslookup flight-bot.com
```

### URLs para probar:
- **Temporal (funcionando ahora)**: https://flight-pjz6byjzi-martuuus-projects.vercel.app
- **Objetivo**: https://flight-bot.com (después de propagación DNS)

## 🎯 Configuración Final Esperada:


### En Hostinger:
```
Nameservers:
- ns1.vercel-dns.com
- ns2.vercel-dns.com

Registros DNS: 
- (Vacío - gestionado por Vercel)
```

### En Vercel:
```
- Dominio: flight-bot.com ✅
- Variables de entorno: Configuradas ✅
- SSL: Automático ✅
```

## 🚀 Mientras esperas la propagación:

1. **Inicia el bot backend**:
   ```bash
   cd /Users/martinnavarro/Documents/flight-bot
   npm run pm2:start
   ```

2. **Prueba el sistema** con la URL temporal
3. **Espera 24-48 horas** para la propagación completa

## 💡 ¿Por qué esta solución?

- **Simplicidad**: Un solo lugar gestiona DNS
- **Automático**: SSL, redirects, subdominios automáticos
- **Confiable**: Vercel optimiza todo para su plataforma
- **Menos errores**: No hay que sincronizar dos sistemas

---

## 📋 Resumen de acciones:

1. ✅ **Cambiar nameservers** en Hostinger a Vercel
2. ✅ **Eliminar registros DNS** en Hostinger 
3. ⏱️ **Esperar propagación** (24-48h)
4. 🧪 **Probar flight-bot.com**

¿Procedes con esta solución?
