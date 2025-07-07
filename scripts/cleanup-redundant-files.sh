#!/bin/bash

# 🧹 SCRIPT PARA LIMPIAR ARCHIVOS REDUNDANTES
# ==========================================
# Elimina archivos .md duplicados y scripts obsoletos de la migración

echo "🧹 LIMPIEZA DE ARCHIVOS REDUNDANTES"
echo "=================================="
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Función para confirmar
confirm() {
    read -p "⚠️  $1 (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        return 0
    else
        return 1
    fi
}

cd /Users/martinnavarro/Documents/flight-bot

echo "📋 ARCHIVOS QUE SE VAN A ELIMINAR:"
echo ""
echo -e "${YELLOW}📄 ARCHIVOS .MD REDUNDANTES:${NC}"
echo "   ├── FASE_2_COMPLETION_REPORT.md"
echo "   ├── MIGRACION_RESUMEN_FINAL.md"
echo "   ├── ESTADO_FINAL_MIGRACION.md"
echo "   ├── MIGRACION_ESTADO_FINAL_VERIFICADO.md"
echo "   ├── MIGRATION_DIAGNOSTIC_AND_FIXES.md"
echo "   ├── MIGRATION_FINAL_REPORT.md"
echo "   ├── log-deploy.md"
echo "   ├── LINKING_SYSTEM_DEMO.md"
echo "   └── SERVIDOR_DEDICADO.md"
echo ""
echo -e "${YELLOW}🔧 SCRIPTS OBSOLETOS:${NC}"
echo "   ├── scripts/test-aerolineas-integration.ts"
echo "   ├── scripts/test-bot-command.ts"
echo "   ├── scripts/test-full-linking.ts"
echo "   ├── scripts/test-telegram-production.ts"
echo "   ├── scripts/test-end-to-end-linking.ts"
echo "   ├── scripts/test-all-commands.ts"
echo "   ├── scripts/test-bot-connectivity.ts"
echo "   ├── scripts/test-connectivity.ts"
echo "   ├── scripts/test-env-loading.ts"
echo "   ├── scripts/test-manual-linking.ts"
echo "   ├── scripts/test-real-linking.ts"
echo "   ├── scripts/diagnose-linking.ts"
echo "   ├── scripts/diagnose-webhook.ts"
echo "   ├── scripts/clean-linking.ts"
echo "   └── scripts/create-superadmin.ts (versión compleja)"
echo ""
echo -e "${GREEN}✅ ARCHIVOS QUE SE CONSERVAN:${NC}"
echo "   ├── README.md"
echo "   ├── MIGRATION_COMPLETION_SUMMARY.md"
echo "   ├── GUIA_NUEVAS_FUNCIONALIDADES.md"
echo "   ├── scripts/reset-database.ts"
echo "   ├── scripts/full-reset.sh"
echo "   ├── scripts/ultimate-reset.sh"
echo "   ├── scripts/create-superadmin-simple.ts"
echo "   ├── scripts/setup-dedicated-server.ts"
echo "   └── scripts/setup-telegram-webhook.ts"
echo ""

if ! confirm "¿Proceder con la limpieza de archivos redundantes?"; then
    echo "❌ Limpieza cancelada"
    exit 1
fi

echo ""
echo -e "${YELLOW}🧹 Iniciando limpieza...${NC}"

# Crear directorio de backup
mkdir -p .cleanup-backup/md-files
mkdir -p .cleanup-backup/scripts

echo "📦 Creando backup de archivos eliminados..."

# Backup y eliminación de archivos .md redundantes
declare -a md_files=(
    "FASE_2_COMPLETION_REPORT.md"
    "MIGRACION_RESUMEN_FINAL.md" 
    "ESTADO_FINAL_MIGRACION.md"
    "MIGRACION_ESTADO_FINAL_VERIFICADO.md"
    "MIGRATION_DIAGNOSTIC_AND_FIXES.md"
    "MIGRATION_FINAL_REPORT.md"
    "log-deploy.md"
    "LINKING_SYSTEM_DEMO.md"
    "SERVIDOR_DEDICADO.md"
)

echo ""
echo -e "${YELLOW}🗑️  Eliminando archivos .md redundantes...${NC}"

for file in "${md_files[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" ".cleanup-backup/md-files/"
        rm "$file"
        echo "   ✅ $file"
    else
        echo "   ⚠️  $file (no encontrado)"
    fi
done

# Backup y eliminación de scripts obsoletos
declare -a script_files=(
    "scripts/test-aerolineas-integration.ts"
    "scripts/test-bot-command.ts"
    "scripts/test-full-linking.ts"
    "scripts/test-telegram-production.ts"
    "scripts/test-end-to-end-linking.ts"
    "scripts/test-all-commands.ts"
    "scripts/test-bot-connectivity.ts"
    "scripts/test-connectivity.ts"
    "scripts/test-env-loading.ts"
    "scripts/test-manual-linking.ts"
    "scripts/test-real-linking.ts"
    "scripts/diagnose-linking.ts"
    "scripts/diagnose-webhook.ts"
    "scripts/clean-linking.ts"
    "scripts/create-superadmin.ts"
)

echo ""
echo -e "${YELLOW}🗑️  Eliminando scripts obsoletos...${NC}"

for file in "${script_files[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" ".cleanup-backup/scripts/"
        rm "$file"
        echo "   ✅ $file"
    else
        echo "   ⚠️  $file (no encontrado)"
    fi
done

echo ""
echo -e "${GREEN}🎉 LIMPIEZA COMPLETADA${NC}"
echo ""
echo -e "${GREEN}📊 RESUMEN:${NC}"

# Contar archivos eliminados
md_count=$(ls -1 .cleanup-backup/md-files/ 2>/dev/null | wc -l)
script_count=$(ls -1 .cleanup-backup/scripts/ 2>/dev/null | wc -l)

echo "   📄 Archivos .md eliminados: $md_count"
echo "   🔧 Scripts eliminados: $script_count"
echo "   📦 Backup creado en: .cleanup-backup/"
echo ""

echo -e "${YELLOW}💡 NOTA:${NC}"
echo "   Si necesitas algún archivo eliminado, búscalo en .cleanup-backup/"
echo "   Puedes eliminar la carpeta .cleanup-backup/ cuando estés seguro."
echo ""

echo -e "${GREEN}📋 ARCHIVOS IMPORTANTES CONSERVADOS:${NC}"
ls -la scripts/*.{ts,sh} 2>/dev/null | grep -E "(reset|setup|create-superadmin-simple|ultimate)" | awk '{print "   ✅", $9}'
echo ""
ls -la *.md 2>/dev/null | grep -E "(README|MIGRATION_COMPLETION|GUIA_NUEVAS)" | awk '{print "   ✅", $9}'

echo ""
echo -e "${GREEN}✨ ¡Workspace limpio y organizado!${NC}"
