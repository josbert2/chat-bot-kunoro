#!/bin/bash

# Script para iniciar el sistema completo en modo producción/desarrollo

echo "🚀 Iniciando Sistema Kunoro Chat"
echo "================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para verificar si un puerto está en uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${YELLOW}⚠️  Puerto $1 ya está en uso${NC}"
        return 1
    else
        return 0
    fi
}

# Verificar puertos
echo -e "${BLUE}🔍 Verificando puertos...${NC}"
check_port 3001 || echo "   (Backend API)"
check_port 3000 || echo "   (Dashboard)"
check_port 3003 || echo "   (Widget Dev)"
echo ""

# 1. Compilar el widget
echo -e "${BLUE}📦 Compilando widget...${NC}"
cd apps/widget
npm run build:dashboard
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Widget compilado y copiado a dashboard/public/${NC}"
else
    echo -e "${RED}❌ Error compilando widget${NC}"
    exit 1
fi
echo ""

# 2. Iniciar Backend API
echo -e "${BLUE}🔧 Iniciando Backend API (puerto 3001)...${NC}"
cd ../api-express

# Verificar si existe .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  No se encontró .env en api-express${NC}"
    echo "   Creando .env de ejemplo..."
    cat > .env << EOF
PORT=3001
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3530
DATABASE_USER=chatbot
DATABASE_PASSWORD=chatbot_pw
DATABASE_NAME=chatbot
JWT_SECRET=tu-secreto-super-seguro-cambiame-en-produccion
NODE_ENV=development
EOF
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
fi

# Iniciar backend en background
npm run dev > ../../logs/api.log 2>&1 &
API_PID=$!
echo -e "${GREEN}✅ Backend iniciado (PID: $API_PID)${NC}"
echo "   📝 Logs: logs/api.log"
echo ""

# Esperar a que el backend inicie
echo -e "${BLUE}⏳ Esperando a que el backend inicie...${NC}"
sleep 3

# 3. Iniciar Dashboard
echo -e "${BLUE}🎨 Iniciando Dashboard (puerto 3000)...${NC}"
cd ../dashboard

# Verificar si existe .env.local
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  No se encontró .env.local en dashboard${NC}"
    echo "   Creando .env.local de ejemplo..."
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF
    echo -e "${GREEN}✅ Archivo .env.local creado${NC}"
fi

# Iniciar dashboard en background
npm run dev > ../../logs/dashboard.log 2>&1 &
DASHBOARD_PID=$!
echo -e "${GREEN}✅ Dashboard iniciado (PID: $DASHBOARD_PID)${NC}"
echo "   📝 Logs: logs/dashboard.log"
echo ""

# Esperar a que el dashboard inicie
echo -e "${BLUE}⏳ Esperando a que el dashboard inicie...${NC}"
sleep 5

# Guardar PIDs para poder detener después
cd ../..
mkdir -p .pids
echo $API_PID > .pids/api.pid
echo $DASHBOARD_PID > .pids/dashboard.pid

# 4. Abrir demo site
echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ Sistema iniciado exitosamente${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}📍 URLs disponibles:${NC}"
echo ""
echo -e "   🎨 Dashboard:    ${GREEN}http://localhost:3000${NC}"
echo -e "   🔧 API:          ${GREEN}http://localhost:3001/v1/health${NC}"
echo -e "   📄 Demo Site:    ${GREEN}file://$(pwd)/demo-site.html${NC}"
echo ""
echo -e "${YELLOW}📝 Próximos pasos:${NC}"
echo ""
echo "   1. Abre el dashboard: http://localhost:3000"
echo "   2. Regístrate o inicia sesión"
echo "   3. Ve a Settings → Apariencia"
echo "   4. Copia tu App ID"
echo "   5. Edita demo-site.html y reemplaza el App ID"
echo "   6. Abre demo-site.html en tu navegador"
echo "   7. Prueba el chat en vivo!"
echo ""
echo -e "${BLUE}🛑 Para detener todo:${NC}"
echo "   ./stop-production.sh"
echo ""
echo -e "${BLUE}📊 Ver logs en tiempo real:${NC}"
echo "   tail -f logs/api.log"
echo "   tail -f logs/dashboard.log"
echo ""

# Mantener el script corriendo para mostrar logs
echo -e "${YELLOW}Presiona Ctrl+C para detener todos los servicios${NC}"
echo ""

# Trap para limpiar al salir
trap 'echo ""; echo "🛑 Deteniendo servicios..."; kill $API_PID $DASHBOARD_PID 2>/dev/null; rm -f .pids/*.pid; echo "✅ Servicios detenidos"; exit 0' INT TERM

# Mostrar logs en tiempo real
tail -f logs/api.log logs/dashboard.log 2>/dev/null

