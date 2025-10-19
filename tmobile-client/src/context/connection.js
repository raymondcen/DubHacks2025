/**********************************
 *
 * Single Web Socket instance to get data from
 * Raspberry Pi 5
 *
 **********************************/


import { io } from "socket.io-client";

const listeners = {};           // dynamic registry of event → [callbacks]
let statusListeners = [];
let socket = null;

const PORT = 5000;
const RECON_DELAY_MS = 1000;
const TIMEOUT_MS = 3000;

/**
 * Initialize socket connection.
 * Must be called once with the Pi’s IP or hostname.
 */
export function initWebSocket(PiAddr) {
  if (socket) return socket;  // already connected

  const serverAddr = `http://${PiAddr}:${PORT}`;
  socket = io(serverAddr, {
    transports: ["websocket"],
    reconnectionAttempts: 3,
    timeout: TIMEOUT_MS,
    reconnectionDelay: RECON_DELAY_MS,
  });

  socket.on("connect", () => {
    console.log(`[Client]: Connected ${socket.id}`);
    socket.emit("clientReady", { client: socket.id });
    notifyStatus({ connected: true, message: "Connected to Raspberry Pi" });
  });

  socket.on("disconnect", () => {
    console.log("[Client]: Disconnected");
    notifyStatus({ connected: false, message: "Disconnected from Raspberry Pi" });
  });

  socket.on("connect_error", (err) => {
    console.log(`[Client]: Connection error: ${err.message}`);
    notifyStatus({ connected: false, message: "Failed to connect to Raspberry Pi" });
  });

  // Global dispatcher: routes every event to listeners[event]
  socket.onAny((event, data) => {
    if (listeners[event]) {
      listeners[event].forEach((cb) => cb(data));
    }
  });

  return socket;
}

/** Subscribe to status updates (connect/disconnect) */
export function statusUpdates(callback) {
  statusListeners.push(callback);
  return () => {
    statusListeners = statusListeners.filter((cb) => cb !== callback);
  };
}

/** Subscribe to a specific event type emitted by the Pi */
export function subscribe(eventType, callback) {
  if (!socket) throw new Error("initWebSocket(PiAddr) must be called first");

  if (!listeners[eventType]) listeners[eventType] = [];
  listeners[eventType].push(callback);

  return () => {
    listeners[eventType] = listeners[eventType].filter((cb) => cb !== callback);
  };
}

/** Emit a message back to the Pi */
export function sendMessage(eventType, data) {
  if (socket && socket.connected) {
    socket.emit(eventType, data);
  } else {
    console.warn("[Client]: Socket not connected");
  }
}

/** Internal helper */
function notifyStatus(status) {
  statusListeners.forEach((cb) => cb(status));
}