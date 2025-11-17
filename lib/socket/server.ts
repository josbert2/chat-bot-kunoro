import { Server as HTTPServer } from "http";
import type { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { publishAccountEvent, publishConversationEvent } from "@/lib/event-bus";

type SocketServerWithIO = HTTPServer & {
  io?: SocketIOServer;
};

declare global {
  // eslint-disable-next-line no-var
  var _socketServer: SocketIOServer | undefined;
}

export function getSocketServer(res: NextApiResponse) {
  if (!global._socketServer) {
    const httpServer = (res.socket as any)?.server as SocketServerWithIO | undefined;
    if (!httpServer) {
      throw new Error("No se pudo acceder al servidor HTTP para inicializar Socket.IO");
    }

    if (httpServer.io) {
      global._socketServer = httpServer.io;
    } else {
      const io = new SocketIOServer(httpServer, {
        path: "/api/socket/io",
        addTrailingSlash: false,
        serveClient: false,
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
      });

      io.on("connection", (socket) => {
        const { rooms } = socket.handshake.auth || {};
        if (Array.isArray(rooms)) {
          rooms
            .filter((room): room is string => typeof room === "string" && room.includes(":"))
            .forEach((room) => socket.join(room));
        }

        socket.on("join", (room: string) => {
          if (typeof room === "string" && room.includes(":")) {
            socket.join(room);
          }
        });

        socket.on("leave", (room: string) => {
          if (typeof room === "string" && room.includes(":")) {
            socket.leave(room);
          }
        });

        socket.on("typing", (payload?: { conversationId?: string; sender?: string; status?: string }) => {
          if (!payload?.conversationId || typeof payload.conversationId !== "string") return;
          socket.to(`conversation:${payload.conversationId}`).emit("event", {
            type: "typing",
            sender: payload.sender,
            status: payload.status,
            conversationId: payload.conversationId,
          });
        });

        socket.on("presence", (payload?: { conversationId?: string; sender?: string; status?: string }) => {
          if (!payload?.conversationId || typeof payload.conversationId !== "string") return;
          socket.to(`conversation:${payload.conversationId}`).emit("event", {
            type: "presence",
            sender: payload.sender,
            status: payload.status,
            conversationId: payload.conversationId,
          });
        });
      });

      httpServer.io = io;
      global._socketServer = io;
    }
  }

  return global._socketServer;
}

export function emitConversationEvent(conversationId: string, event: unknown) {
  global._socketServer?.to(`conversation:${conversationId}`).emit("event", event);
  publishConversationEvent(conversationId, event as any);
}

export function emitAccountEvent(accountId: string, event: unknown) {
  global._socketServer?.to(`account:${accountId}`).emit("event", event);
  publishAccountEvent(accountId, event as any);
}


