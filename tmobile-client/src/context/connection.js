/**********************************
 *
 * Single Web Socket instance to get data from
 * Raspberry Pi 5
 *
 **********************************/

import { io } from "socket.io-client";

const listeners = { frame: [], event: [] };
let statusListeners = [];
const ReconnectionDelay_ms = 1000;
const ConnectionTimeout_ms = 3000;
let socket = null;

export function initWebSocket(PiAddr) {
  const Port = 5000;
  const ServerAddr = `http://${PiAddr}:${Port}`;

  if (socket) {
    return socket;
  }
  socket = io(
    ServerAddr,
    {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      timeout: ConnectionTimeout_ms,
      reconnectionDelay: ReconnectionDelay_ms
    }
  );
  socket.on("connect_error", (error) => {
    console.log(`[Client]: Failed to connect, ${error}`);
    notifyStatus({ "connected": false, "message": "Failed to connect to Raspberry Pi" });
  });
  socket.on("connect", () => {
    console.log(`[Client]: Connected ${socket.id}`);
    notifyStatus({ "connected": true, "message": "Connected to Raspberry Pi" });
  });
  socket.on("disconnect", () => {
    console.log(`[Client]: Disconnected`);
    notifyStatus({ "connected": false, "message": "Disconnected from Raspberry Pi" });
  });
  socket.onAny((update, data) => {
    if (listeners[update]) {
      listeners[update].forEach((cb) => cb(data));
    }
  });
  return socket;
}

export function statusUpdates(callback) {
  statusListeners.push(callback);
  
  return () => {
    statusListeners = statusListeners.filter((cb) => cb !== callback);
  };
}

export function subscribe(eventType, callback) {
  if (!listeners[eventType]) listeners[eventType] = [];
  listeners[eventType].push(callback);

  // Ensure socket listens to that event
  const sock = initWebSocket();
  sock.on(eventType, callback);

  // Return unsubscribe function
  return () => {
    listeners[eventType] = listeners[eventType].filter((cb) => cb !== callback);
    sock.off(eventType, callback);
  };
}

export function sendMessage(type, data) {
  if (socket && socket.connected) {
    socket.emit(type, data);
  } else {
    console.warn("[Client]: Socket not connected");
  }
}

function notifyStatus(status) {
  statusListeners.forEach((cb) => cb(status));
}
