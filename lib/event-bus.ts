import { EventEmitter } from "events";

type RoomEvent = {
  type: string;
  [key: string]: any;
};

type GlobalEmitter = EventEmitter & {
  __rooms?: Map<string, number>;
};

declare const globalThis: {
  __eventEmitter?: GlobalEmitter;
} & typeof global;

const emitter: GlobalEmitter =
  globalThis.__eventEmitter ??
  (() => {
    const instance = new EventEmitter() as GlobalEmitter;
    instance.setMaxListeners(0);
    return instance;
  })();

if (!globalThis.__eventEmitter) {
  globalThis.__eventEmitter = emitter;
}

export function publishRoomEvent(room: string, event: RoomEvent) {
  emitter.emit(room, event);
}

export function publishConversationEvent(conversationId: string, event: RoomEvent) {
  publishRoomEvent(`conversation:${conversationId}`, event);
}

export function publishAccountEvent(accountId: string, event: RoomEvent) {
  publishRoomEvent(`account:${accountId}`, event);
}

export function createEventStream(room: string, initialEvent?: RoomEvent) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const send = (event: RoomEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`:heartbeat\n\n`));
      }, 15000);

      emitter.on(room, send);

      if (initialEvent) {
        send(initialEvent);
      }

      controller.enqueue(encoder.encode(`retry: 5000\n\n`));

      return () => {
        clearInterval(heartbeat);
        emitter.off(room, send);
      };
    },
    cancel() {
      emitter.removeAllListeners(room);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}


