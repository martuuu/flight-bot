# 🎯 Acción Específica: Solo cambiar Nameservers en Hostinger

## ✅ En Vercel: NO TOCAR NADA
Tu configuración de DNS en Vercel está PERFECTA:
- CNAME www → cname.vercel-dns.com ✅
- A @ → 76.76.19.61 ✅
- CAA records para SSL ✅

## 🔧 ÚNICA acción necesaria: Hostinger Nameservers

### Paso 1: Ve a Hostinger
1. **DNS / Nameservers** → **Nameservers** (no "Administrar registros DNS")
2. **"Cambiar nameservers"**

### Paso 2: Cambia SOLO esto:
```
DE:
ns1.dns-parking.com
ns2.dns-parking.com

A:
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### Paso 3: En "Administrar registros DNS" de Hostinger
**ELIMINA TODOS** los registros que creaste:
- ❌ CNAME www → cname.vercel-dns.com
- ❌ A @ → 76.76.19.61  
- ❌ Cualquier otro registro

**¿Por qué eliminarlos?**
Porque una vez que cambies los nameservers a Vercel, Vercel gestionará TODOS los registros DNS automáticamente. Si dejas registros en Hostinger, pueden crear conflictos.

## 🎯 Flujo de funcionamiento:

```
Usuario → flight-bot.com 
    ↓
Nameservers de Vercel (ns1.vercel-dns.com)
    ↓  
DNS Records en Vercel (los que viste en el screenshot)
    ↓
Tu webapp funcionando
```

## ⏱️ Resultado esperado:

**Después de 24-48 horas:**
- flight-bot.com → Funcionará
- www.flight-bot.com → Funcionará  
- SSL automático → Funcionará

**Ahora mismo:**
- URL temporal → https://flight-pjz6byjzi-martuuus-projects.vercel.app (Funciona)

## 🚀 Acción inmediata:

Mientras cambias los nameservers y esperas, puedes:

1. **Iniciar el bot backend**:
   ```bash
   cd /Users/martinnavarro/Documents/flight-bot
   npm run pm2:start
   npm run pm2:status
   ```

2. **Probar el sistema completo** con la URL temporal

---

## 📋 Resumen ultra-claro:

1. **Vercel**: ✅ No tocar (está perfecto)
2. **Hostinger**: 
   - Cambiar nameservers a Vercel
   - Eliminar registros DNS manuales
3. **Esperar**: 24-48 horas
4. **Mientras tanto**: Usar URL temporal y probar el bot

¿Procedes con el cambio de nameservers en Hostinger?
