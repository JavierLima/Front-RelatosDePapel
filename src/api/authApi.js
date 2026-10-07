const API_BASE_URL = "http://localhost:8080/api/users";

export async function login(email, password) {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    if (!response.ok) {
        throw new Error("Credenciales incorrectas");
    }

    const data = await response.json();

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
}

export async function register(fullName, email, password) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fullName,
            email,
            password
        })
    });

    if (!response.ok) {
        throw new Error("No se pudo registrar el usuario");
    }

    return response.json();
}

export function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
}

export function getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

export function getAccessToken() {
    return localStorage.getItem("accessToken");
}