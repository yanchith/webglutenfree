/**
 * Component wrapping an iframe element. Supports sending to iframe#postMessage()
 * and listening on window.onmessage. Sent messages are queued until the
 * component is rendered and iframe loaded.
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
        if (this._element) {
            unmount();
        }
        this._element = iframe;

        this._element.addEventListener("load", this._onLoad);

        window.addEventListener("message", this._onMessage);

        this._element.allowFullscreen = true;
        this._element.style.width = "100%";
        this._element.style.height = "100%";

        // Starts loading (even if there is something loaded already)
        this._element.src = this._src;
    }

    remount() {
        if (this._element) {
            const elem = this._element;
            this.unmount();
            this.mount(elem);
        } else {
            console.warn("Element not mounted");
        }
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
