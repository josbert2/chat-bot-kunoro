-- Script de inicialización para crear la base de datos y otorgar permisos al usuario chatbot
-- Este script se ejecuta automáticamente cuando el contenedor MySQL se crea por primera vez

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS chatbot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Otorgar todos los privilegios al usuario chatbot desde cualquier host
GRANT ALL PRIVILEGES ON chatbot.* TO 'chatbot'@'%' IDENTIFIED BY 'chatbot_pw';
FLUSH PRIVILEGES;

