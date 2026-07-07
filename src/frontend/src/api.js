/**
 * Basic wrapper around fetch() to handle JSON and credentials (HttpOnly cookies) automatically.
 */
const apiFetch = async (url, options = {}) => {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        // Crucial for sending/receiving HttpOnly cookies
        credentials: 'include',
    };

    const mergedOptions = { ...defaultOptions, ...options };

    if (mergedOptions.body && typeof mergedOptions.body === 'object') {
        mergedOptions.body = JSON.stringify(mergedOptions.body);
    }

    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
        let errorMsg = 'An error occurred';
        try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
        } catch (e) {
            // Not JSON
            errorMsg = await response.text() || errorMsg;
        }
        throw new Error(errorMsg);
    }

    // Not all responses have JSON bodies (like 204 No Content), but our API mostly returns JSON
    const text = await response.text();
    return text ? JSON.parse(text) : null;
};

export const api = {
    get: (url, options) => apiFetch(url, { ...options, method: 'GET' }),
    post: (url, body, options) => apiFetch(url, { ...options, method: 'POST', body }),
    put: (url, body, options) => apiFetch(url, { ...options, method: 'PUT', body }),
    delete: (url, options) => apiFetch(url, { ...options, method: 'DELETE' }),
};
