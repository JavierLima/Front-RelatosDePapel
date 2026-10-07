import { getAccessToken } from "./authApi.js"

const API_BASE_URL = "http://localhost:8080/api/orders"

export async function createOrder(bookId, quantity) {
    const token = getAccessToken();

    const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            bookId,
            quantity
        })
    });

    if (!response.ok) {
        let backendMessage = "";

        try {
            const errorBody = await response.json();
            backendMessage = errorBody.message || errorBody.error || "";
        } catch {
            backendMessage = "";
        }

        if (response.status === 401) {
            throw new Error("Tu sesión ha caducado o no has iniciado sesión. Vuelve a iniciar sesión.");
        }

        if (response.status === 403) {
            throw new Error("No tienes permisos para realizar este pedido.");
        }

        if (response.status === 404) {
            throw new Error("El libro seleccionado ya no está disponible.");
        }

        if (response.status === 409) {
            throw new Error("No hay stock suficiente para completar el pedido.");
        }

        if (response.status >= 500) {
            throw new Error("Ha ocurrido un error interno al procesar el pedido. Inténtalo más tarde.");
        }

        throw new Error(backendMessage || "No se pudo crear el pedido.");
    }

    return response.json();
}

export async function getRecentOrders() {
    const token = getAccessToken();

    const response = await fetch(`${API_BASE_URL}/me/recent`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("Tu sesión ha caducado. Vuelve a iniciar sesión.");
        }

        if (response.status === 403) {
            throw new Error("No tienes permisos para consultar estos pedidos.");
        }

        throw new Error("No se pudieron cargar los pedidos.");
    }

    return response.json();
}