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

export function initWebSocket(url = `ws:${PiUrl}:${Port}/ws`) {
  if (!socket) {
    socket = new WebSocket(url);

    // TODO: Stretch goal is to type in the raspberry pi IP before connecting
    socket.onopen = () => console.log("Connected");
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