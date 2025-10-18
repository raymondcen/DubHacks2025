/**********************************
 * 
 * Single Web Socket instance to get data from
 * Raspberry Pi 5
 * 
 **********************************/

let socket = null;
const listeners = { frame: [], event: [] };
const PiUrl = "TODO: add url when done";

export function initWebSocket(url = `ws:${PiUrl}`) {
  if (!socket) {
    socket = new WebSocket(url);

    // TODO: Stretch goal is to type in the raspberry pi IP before connecting
    socket.onopen = () => console.log("Connected");
    socket.onclose = () => console.log("Disconnected");

    socket.onmessage = (msg) => {
      try {
        // Strip SocketIO prefix (if using Flask-SocketIO)
        const payload = JSON.parse(msg.data.replace(/^42/, ""));

        // Dispatch to listeners by type
        if (payload.type && listeners[payload.type]) {
          listeners[payload.type].forEach((cb) => cb(payload));
        }
      } catch (err) {
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
