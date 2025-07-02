🤖 GUÍA DE TESTING EN VIVO - @ticketscannerbot_bot
================================================

🎯 **OBJETIVO**
Probar los nuevos comandos unificados en tu bot de Telegram real.

📱 **BOT DE TELEGRAM**: https://t.me/ticketscannerbot_bot

🧪 **COMANDOS PARA PROBAR**
===========================

### 1️⃣ **Verificar Help Actualizado**
```
/help
```
✅ **Esperado**: Debe mostrar la nueva sintaxis con `/addalert` y `/agregaralerta`

### 2️⃣ **Comando Básico Unificado**
```
/addalert SDQ MIA
```
✅ **Esperado**: Crear alerta para mejor precio SDQ → MIA

### 3️⃣ **Comando en Español**
```
/agregaralerta SDQ MIA 350
```
✅ **Esperado**: Crear alerta con precio máximo $350

### 4️⃣ **Mejor Precio con Guión**
```
/addalert SDQ JFK -
```
✅ **Esperado**: Crear alerta para mejor precio (sin límite)

### 5️⃣ **Alerta Mensual**
```
/addalert SDQ MIA 400 2025-08
```
✅ **Esperado**: Crear alerta para agosto 2025

### 6️⃣ **Alerta Diaria**
```
/addalert SDQ MIA - 2025-08-15
```
✅ **Esperado**: Crear alerta para día específico con mejor precio

### 7️⃣ **Comando Sin Argumentos**
```
/addalert
```
✅ **Esperado**: Mostrar mensaje de uso unificado detallado

### 8️⃣ **Verificar Mis Alertas**
```
/misalertas
```
✅ **Esperado**: Ver todas las alertas creadas

### 9️⃣ **Retrocompatibilidad**
```
/alert SDQ MIA 300
```
✅ **Esperado**: Funcionar con sintaxis antigua

🔍 **QUÉ VERIFICAR**
===================

✅ **Mensajes de Respuesta**:
- Los mensajes deben ser claros y consistentes
- La sintaxis debe aparecer como en el /help
- Los errores deben ser informativos

✅ **Funcionalidad**:
- Las alertas se crean correctamente
- Los botones de navegación funcionan
- `/misalertas` muestra las nuevas alertas

✅ **Soporte Bilingüe**:
- `/addalert` funciona (inglés)
- `/agregaralerta` funciona (español)
- Ambos tienen el mismo comportamiento

✅ **Parser Inteligente**:
- Reconoce `-` como "mejor precio"
- Distingue fechas YYYY-MM vs YYYY-MM-DD
- Valida códigos de aeropuertos

🚨 **POSIBLES PROBLEMAS Y SOLUCIONES**
====================================

❌ **"Usuario no encontrado"**
➡️ **Solución**: Enviar `/start` primero

❌ **"Alerta duplicada"**
➡️ **Solución**: Normal si ya existe esa ruta. Usar `/clearall` para limpiar

❌ **"Código de aeropuerto inválido"**
➡️ **Solución**: Usar códigos válidos como SDQ, MIA, EZE, etc.

❌ **"Error procesando alerta"**
➡️ **Solución**: Revisar logs del bot o intentar comando más simple

📊 **CHECKLIST DE VALIDACIÓN**
==============================

□ Bot responde a `/help` con nueva sintaxis
□ `/addalert SDQ MIA` crea alerta básica
□ `/agregaralerta SDQ MIA 300` funciona en español
□ `/addalert SDQ MIA -` reconoce guión como mejor precio
□ `/addalert SDQ MIA 300 2025-08` crea alerta mensual
□ `/addalert SDQ MIA - 2025-08-15` crea alerta diaria
□ Comando sin argumentos muestra uso unificado
□ `/misalertas` muestra alertas nuevas
□ Comandos antiguos (`/alert`) siguen funcionando
□ Validaciones de errores son claras

🎉 **CRITERIOS DE ÉXITO**
========================

✅ **Nivel Básico**: Comandos responden y crean alertas
✅ **Nivel Intermedio**: Parser reconoce diferentes formatos
✅ **Nivel Avanzado**: Experiencia fluida y mensajes claros

📞 **SIGUIENTE PASO**
====================

Una vez completado este testing en vivo:
1. 📝 Documentar cualquier comportamiento inesperado
2. 🔧 Ajustar según feedback real de uso
3. 🌐 Preparar integración con la webapp
4. 🚀 Desplegar versión final

¡Tu bot @ticketscannerbot_bot está listo para las pruebas! 🚀
