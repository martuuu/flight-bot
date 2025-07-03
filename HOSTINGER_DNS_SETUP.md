# 🔧 Configuración DNS en Hostinger para flight-bot.com

## 📊 Análisis de la configuración actual:

### ✅ Correcto:
- **CNAME**: `www` → `cname.vercel-dns.com` 

### ❌ Problema identificado:
- **Registro A**: `@` → `216.198.7.91` (IP incorrecta)

## 🔧 Solución paso a paso:

### 1. Modificar el registro A existente:

**En tu panel de Hostinger:**

1. Ve a **DNS / Nameservers** → **Administrar registros DNS**
2. Encuentra el registro tipo **A** con nombre `@`
3. Haz clic en **"Editar"**
4. Cambia los valores a:
   ```
   Tipo: A
   Nombre: @
   Contenido: 76.76.19.61
   TTL: 14400
   ```

### 2. Alternativa (Si el registro A no funciona):

Si Hostinger no permite usar el registro A con esa IP, elimina el registro A y crea un CNAME:

1. **Borrar** el registro A existente (`@` → `216.198.7.91`)
2. **Agregar registro** nuevo:
   ```
   Tipo: CNAME
   Nombre: @
   Contenido: cname.vercel-dns.com
   TTL: 14400
   ```

### 3. Verificar la configuración final:

Deberías tener estos registros:
```
CNAME | www | cname.vercel-dns.com | 14400
CNAME | @   | cname.vercel-dns.com | 14400
```

## ⏱️ Tiempo de propagación:

- **CNAME**: 5-10 minutos
- **Registro A**: 10-30 minutos

## 🧪 Verificación:

### Mientras esperas, puedes verificar:

```bash
# Verificar DNS (espera unos minutos después del cambio)
nslookup flight-bot.com

# Verificar que la webapp funciona con URL temporal
curl -I https://flight-pjz6byjzi-martuuus-projects.vercel.app
```

### URLs para probar:
- **Temporal (funcionando)**: https://flight-pjz6byjzi-martuuus-projects.vercel.app
- **Objetivo**: https://flight-bot.com (después de la propagación DNS)

## 🎯 IP correcta de Vercel:

Si necesitas usar registro A en lugar de CNAME, la IP correcta es:
```
76.76.19.61
```

## 📞 Siguiente paso:

1. **Haz los cambios** según las instrucciones arriba
2. **Espera 5-10 minutos**
3. **Prueba** https://flight-bot.com
4. **Mientras tanto**, puedes iniciar el bot backend y probar con la URL temporal

¿Quieres que te guíe mientras haces los cambios en Hostinger?
