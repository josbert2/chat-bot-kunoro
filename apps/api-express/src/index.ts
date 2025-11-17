import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { authRouter } from './routes/auth.routes.js';
import { healthRouter } from './routes/health.routes.js';
import { workspacesRouter } from './routes/workspaces.routes.js';
import { projectsRouter } from './routes/projects.routes.js';
import { conversationsRouter } from './routes/conversations.routes.js';
import { messagesRouter } from './routes/messages.routes.js';
import { widgetRouter } from './routes/widget.routes.js';
import { endUsersRouter } from './routes/end-users.routes.js';
import { analyticsRouter } from './routes/analytics.routes.js';
import { aiRouter } from './routes/ai.routes.js';
import { onboardingRouter } from './routes/onboarding.routes.js';
import { simulatorRouter } from './routes/simulator.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { db } from './db/connection.js';

// Cargar variables de entorno
config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true,
  }
});

const PORT = process.env.PORT || 3001;

// Socket.IO global para usar en otros módulos
export { io };

// Middleware
app.use(helmet());
app.use(cors({
  origin: true, // Permitir todos los orígenes para desarrollo
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging de requests
app.use((req, res, next) => {
  console.log(`🔵 ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/v1/health', healthRouter);
app.use('/v1/auth', authRouter);
app.use('/v1/workspaces', workspacesRouter);
app.use('/v1/projects', projectsRouter);
app.use('/v1/conversations', conversationsRouter);
app.use('/v1/messages', messagesRouter);
app.use('/v1/widget', widgetRouter);
app.use('/v1/end-users', endUsersRouter);
app.use('/v1/analytics', analyticsRouter);
app.use('/v1/ai', aiRouter);
app.use('/v1/onboarding', onboardingRouter);
app.use('/v1/simulator', simulatorRouter);

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Iniciar servidor
async function start() {
  try {
    console.log('🔵 [SERVER] Iniciando servidor Express...');
    
    // Probar conexión a DB
    try {
      await db.testConnection();
      console.log('✅ [SERVER] Base de datos conectada');
    } catch (error) {
      console.error('❌ [SERVER] Error de base de datos:', error);
      console.warn('⚠️  [SERVER] El servidor continuará sin base de datos');
    }

    // Socket.IO listeners
    io.on('connection', (socket) => {
      console.log('🔌 [SOCKET] Cliente conectado:', socket.id);

      socket.on('disconnect', () => {
        console.log('🔌 [SOCKET] Cliente desconectado:', socket.id);
      });
    });

    httpServer.listen(PORT, () => {
      console.log(`✅ [SERVER] API corriendo en http://localhost:${PORT}`);
      console.log(`✅ [SERVER] Health check: http://localhost:${PORT}/v1/health`);
      console.log(`✅ [SERVER] Docs: http://localhost:${PORT}/v1/health/docs`);
      console.log(`🔌 [SOCKET] Socket.IO listo`);
    });
  } catch (error) {
    console.error('❌ [SERVER] Error fatal al iniciar:', error);
    process.exit(1);
  }
}

start();

