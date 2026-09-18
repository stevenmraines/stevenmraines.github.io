export function getCookie(cookie, default_value = '') {
    const match = document.cookie
        .split('; ')
        .find((c) => c.startsWith(cookie + '='));

    return match ? match.slice(cookie.length + 1) : default_value;
}

export function setCookie(cookie, value) {
    document.cookie = `${cookie}=${value}; Secure`;
}

export function parseBoolean(value) {
    return JSON.parse(value);
}

export function hex2Str(hex) {
    return typeof hex === 'number' ? '#' + hex.toString(16).padStart(6, '0').toLowerCase() : hex;
}

export function str2Hex(str) {
    return typeof str === 'string' ? parseInt(str.substring(1), 16) : str;
}

export function getBreakpoint(breakpoint_name) {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(`--breakpoint-${breakpoint_name}`)
        .trim();
}

export function remToPx(rem) {
    const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return parseFloat(rem) * fontSize;
}
