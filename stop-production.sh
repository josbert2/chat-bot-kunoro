#!/bin/bash

# Script para detener todos los servicios

echo "🛑 Deteniendo Sistema Kunoro Chat..."
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Función para detener un proceso por PID
stop_service() {
    SERVICE_NAME=$1
    PID_FILE=$2
    
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if kill -0 $PID 2>/dev/null; then
            echo -e "${YELLOW}Deteniendo $SERVICE_NAME (PID: $PID)...${NC}"
            kill $PID
            sleep 1
            if kill -0 $PID 2>/dev/null; then
                echo -e "${RED}Forzando cierre de $SERVICE_NAME...${NC}"
                kill -9 $PID
            fi
            echo -e "${GREEN}✅ $SERVICE_NAME detenido${NC}"
        else
            echo -e "${YELLOW}⚠️  $SERVICE_NAME ya estaba detenido${NC}"
        fi
        rm -f "$PID_FILE"
    else
        echo -e "${YELLOW}⚠️  No se encontró PID para $SERVICE_NAME${NC}"
    fi
}

# Detener servicios
stop_service "Backend API" ".pids/api.pid"
stop_service "Dashboard" ".pids/dashboard.pid"

# Limpiar directorio de PIDs
rm -rf .pids

# Detener cualquier proceso en los puertos por si acaso
echo ""
echo -e "${YELLOW}Verificando puertos...${NC}"

for port in 3001 3000 3003; do
    PID=$(lsof -ti:$port)
    if [ ! -z "$PID" ]; then
        echo -e "${YELLOW}Deteniendo proceso en puerto $port (PID: $PID)...${NC}"
        kill -9 $PID 2>/dev/null
    fi
done

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ Todos los servicios detenidos${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

