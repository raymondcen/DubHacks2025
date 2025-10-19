/**********************************
 * 
 * Single Web Socket instance to get data from
 * Raspberry Pi 5
 * 
 **********************************/

let socket = null;
const listeners = { frame: [], event: [] };
const PiUrl = import.meta.env.VITE_PI_IPADDR;
const Port = 5000;

export function initWebSocket(ipAddress = PiUrl, onSuccess = null, onError = null) {
  if (!socket) {
    const url = `ws://${ipAddress}:${Port}/ws`;
    socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("Connected");
      if (onSuccess) onSuccess();
    };

    socket.onerror = (error) => {
      console.error("Connection error:", error);
      if (onError) onError(error);
    };

    socket.onclose = () => console.log("Disconnected");

    socket.onmessage = (msg) => {
      try {
        const payload = JSON.parse(msg.data);

        // Dispatch to listeners by type
        if (payload.type && listeners[payload.type]) {
          listeners[payload.type].forEach((cb) => cb(payload));
        }
      }
      catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };
  }
  return socket;
}

export function subscribe(type, callback) {
  if (!listeners[type]) listeners[type] = [];
  listeners[type].push(callback);

  return () => {
    // Unsubscribe function
    listeners[type] = listeners[type].filter((cb) => cb !== callback);
  };
}

export function sendMessage(msg) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msg));
  }
  else {
    console.log("socket not ready");
  }
}

export function getSocket() {
  return socket;
}

export function isConnected() {
  return socket && socket.readyState === WebSocket.OPEN;
}