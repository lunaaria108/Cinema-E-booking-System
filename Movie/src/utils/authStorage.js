const AUTH_TOKEN_KEY = "cinemaAuthToken";
const AUTH_USER_KEY = "cinemaAuthUser";

export function loadAuthState() {
    if (typeof window === "undefined") {
        return { token: null, user: null };
    }

    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    const userRaw = window.localStorage.getItem(AUTH_USER_KEY);

    return {
        token,
        user: userRaw ? JSON.parse(userRaw) : null,
    };
}

export function saveAuthState(authResponse) {
    if (typeof window === "undefined") {
        return;
    }

    if (authResponse?.sessionToken) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, authResponse.sessionToken);
    }

    const user = {
        userId: authResponse?.userId ?? null,
        username: authResponse?.username ?? null,
        email: authResponse?.email ?? null,
        isAdmin: Boolean(authResponse?.isAdmin),
        isActive: Boolean(authResponse?.isActive),
    };

    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthState() {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(AUTH_USER_KEY);
}
