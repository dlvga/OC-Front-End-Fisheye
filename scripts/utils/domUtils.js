export function createElement(tag, { className = '', text = '', attrs = {} } = {}) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    for (const [key, val] of Object.entries(attrs)) {
        el.setAttribute(key, val);
    }
    return el;
}