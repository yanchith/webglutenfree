/**
 * Wrapper over window.postMessage() api. Receives messages on window, posts
 * to window.parent.
 *
 * Use .postMessage() to send a message.
 * Listen for messages using .onMessage().
 */
export class Channel {

    constructor(window = window) {
        if (window.parent === window) {
            console.warn("Our window is the top window, we will message ourselves");
        }

        this._windowRecv = window;
        this._windowSend = window.parent;
        this._callbacks = [];

        this._windowRecv.addEventListener("message", (ev) => {
            if (typeof ev.data === "string") {
                try {
                    const packet = JSON.parse(ev.data);

                    if (typeof packet.message !== "undefined") {
                        this._emit(packet.message);
                    }
                } catch (e) {
                    // Ignore other messages
                }
            }
        });
    }

    postMessage(message) {
        this._windowSend.postMessage(JSON.stringify({ message }), "*");
    }

    onMessage(callback) {
        this._callbacks.push(callback);
    }

    offMessage(callback) {
        this._callbacks = this._callbacks.filter(cb => cb !== callback);
    }

    _emit(msg) {
        this._callbacks.forEach(cb => cb(msg));
    }
}
