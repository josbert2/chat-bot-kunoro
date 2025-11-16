#!/bin/bash

# Script para iniciar todos los servicios en modo desarrollo

echo "🚀 Iniciando servicios de desarrollo..."
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que estamos en el directorio correcto
if [ ! -d "apps/widget" ] || [ ! -d "apps/dashboard" ] || [ ! -d "apps/api-express" ]; then
    echo "❌ Error: Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

echo "${BLUE}📦 Verificando dependencias...${NC}"
echo ""

# Función para verificar si pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm no está instalado. Instálalo con: npm install -g pnpm"
    exit 1
fi

echo "${GREEN}✅ pnpm encontrado${NC}"
echo ""

# Crear logs directory
mkdir -p .dev-logs

echo "${YELLOW}Iniciando servicios en background...${NC}"
echo ""

# 1. API Express
echo "${BLUE}🔧 Iniciando API Express (puerto 3001)...${NC}"
cd apps/api-express
pnpm dev > ../../.dev-logs/api-express.log 2>&1 &
API_PID=$!
echo "   PID: $API_PID"
cd ../..

# 2. Widget
echo "${BLUE}🎨 Iniciando Widget (puerto 3003)...${NC}"
cd apps/widget
pnpm dev > ../../.dev-logs/widget.log 2>&1 &
WIDGET_PID=$!
echo "   PID: $WIDGET_PID"
cd ../..

# 3. Dashboard
echo "${BLUE}🖥️  Iniciando Dashboard (puerto 3000)...${NC}"
cd apps/dashboard
pnpm dev > ../../.dev-logs/dashboard.log 2>&1 &
DASHBOARD_PID=$!
echo "   PID: $DASHBOARD_PID"
cd ../..

# Guardar PIDs
echo "$API_PID" > .dev-logs/api.pid
echo "$WIDGET_PID" > .dev-logs/widget.pid
echo "$DASHBOARD_PID" > .dev-logs/dashboard.pid

echo ""
echo "${GREEN}✅ Todos los servicios iniciados!${NC}"
echo ""
echo "📋 URLs:"
echo "   • Dashboard: ${BLUE}http://localhost:3000${NC}"
echo "   • API:       ${BLUE}http://localhost:3001${NC}"
echo "   • Widget:    ${BLUE}http://localhost:3003${NC}"
echo ""
echo "📝 Logs en: .dev-logs/"
echo ""
echo "Para detener todos los servicios, ejecuta: ${YELLOW}./dev-stop.sh${NC}"
echo ""
echo "Esperando que los servicios inicien..."
sleep 5

# Mostrar estado
echo ""
echo "${GREEN}🎉 Todo listo! Abre http://localhost:3000 en tu navegador${NC}"
echo ""

