
/**
 * Wrapper over window.postMessage() api. Receives messages on window, posts
 * to window.parent.
 *
 * Use .postMessage() to send a message.
 * Listen for messages using .onMessage().
 */
export class PostMessageChannel {

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
        // Do we queue if we have no session yet?
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

/**
 * Component wrapping an iframe element. Supports sending to iframe#postMessage()
 * and listening on window.onmessage. Generates unique session, which the iframe
 * content must send back in order for its messages to be received.
 * Sent messages are queued until the component is rendered, if necessary.
 *
 * Messages can be of any serializable type, e.g. javascript objects.
 */
export class IFrame {

    constructor(src) {
        this._element = undefined;
        this._src = src;
        this._q = [];
        this._callbacks = [];

        this._onLoad = () => {
            const q = this._q;
            this._q = null;

            const success = q.reduce((prev, msg) => {
                return prev && this._send(msg);
            }, true);
        }

        this._onMessage = ev => {
            if (typeof ev.data === "string") {
                let packet;
                try {
                    packet = JSON.parse(ev.data);
                } catch (err) {
                    console.error("Message parsing failed", err);
                }
                this._emit(packet.message);
            }
        }
    }

    /**
     * Returns true if sent or queued, false on error.
     */
    postMessage(msg) {
        if (this._q) {
            this._q.push(msg);
            return true;
        }

        // No queue means loaded & ready
        return this._send(msg);
    }

    onMessage(callback) {
        this._callbacks.push(callback);
    }

    offMessage(callback) {
        this._callbacks = this._callbacks.filter(cb => cb !== callback);
    }

    unmount() {
        if (this._element) {
            window.removeEventListener("message", this._onMessage);
            this._element.removeEventListener("load", this._onLoad);
            this._element.src = null;
            this._element = null;
            this._q = [];
        }
    }

    mount(iframe) {
        if (!this._element) {
            this._element = iframe;

            this._element.addEventListener("load", this._onLoad);

            window.addEventListener("message", this._onMessage);

            this._element.allowFullscreen = true;
            this._element.style.width = "100%";
            this._element.style.height = "100%";

            // Starts loading
            this._element.src = this._src;
        }
        return this._element;
    }

    _send(message) {
        try {
            this._element.contentWindow.postMessage(
                JSON.stringify({ message }),
                "*",
            );
        } catch (err) {
            console.error("IFrame#postMessage error", err);
            return false;
        }
        return true;
    }

    _emit(msg) {
        this._callbacks.forEach(cb => cb(msg));
    }
}

export function debounce(millis, fn) {
    let timeout;
    return () => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(fn, millis);
    };
}
