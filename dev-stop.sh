#!/bin/bash

# Script para detener todos los servicios de desarrollo

echo "🛑 Deteniendo servicios de desarrollo..."
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Función para matar proceso por PID
kill_service() {
    local name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            echo "${RED}Deteniendo $name (PID: $pid)...${NC}"
            kill "$pid"
            rm "$pid_file"
        else
            echo "   $name ya no está corriendo"
            rm "$pid_file"
        fi
    else
        echo "   No se encontró PID para $name"
    fi
}

# Detener servicios
kill_service "API Express" ".dev-logs/api.pid"
kill_service "Widget" ".dev-logs/widget.pid"
kill_service "Dashboard" ".dev-logs/dashboard.pid"

# Matar cualquier proceso Node en los puertos conocidos (backup)
echo ""
echo "Verificando puertos..."

# Puerto 3000 (Dashboard)
lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "   Liberado puerto 3000"

# Puerto 3001 (API)
lsof -ti:3001 | xargs kill -9 2>/dev/null && echo "   Liberado puerto 3001"

# Puerto 3003 (Widget)
lsof -ti:3003 | xargs kill -9 2>/dev/null && echo "   Liberado puerto 3003"

echo ""
echo "${GREEN}✅ Todos los servicios detenidos${NC}"
echo ""

