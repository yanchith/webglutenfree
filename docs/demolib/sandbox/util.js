export function debounce(millis, fn) {
    let timeout;
    return () => {
        if (timeout) { clearTimeout(timeout); }
        timeout = setTimeout(fn, millis);
    };
}
