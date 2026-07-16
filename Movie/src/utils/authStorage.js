const AUTH_TOKEN_KEY = "cinemaAuthToken";
const AUTH_USER_KEY = "cinemaAuthUser";

export function loadAuthState() {
    if (typeof window === "undefined") {
        return {
            token: null,
            user: null,
            userId: null,
        };
    }

    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    const userRaw = window.localStorage.getItem(AUTH_USER_KEY);

    let user = null;

    if (userRaw) {
        try {
            user = JSON.parse(userRaw);
        } catch (error) {
            console.error("Unable to read saved authentication data:", error);
            window.localStorage.removeItem(AUTH_USER_KEY);
        }
    }

    return {
        token,
        user,
        userId: user?.userId ?? null,
    };
}

export function saveAuthState(authResponse) {
    if (typeof window === "undefined") {
        return;
    }

    if (authResponse?.sessionToken) {
        window.localStorage.setItem(
            AUTH_TOKEN_KEY,
            authResponse.sessionToken
        );
    }

    const user = {
        userId: authResponse?.userId ?? null,
        username: authResponse?.username ?? null,
        email: authResponse?.email ?? null,
        isAdmin: Boolean(authResponse?.isAdmin),
        isActive: Boolean(authResponse?.isActive),
    };

    window.localStorage.setItem(
        AUTH_USER_KEY,
        JSON.stringify(user)
    );
}

export function clearAuthState() {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(AUTH_USER_KEY);
}
