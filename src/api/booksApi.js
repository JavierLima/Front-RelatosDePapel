const API_BASE_URL = "http://localhost:8080/api/books";

export async function getBooks() {
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
        throw new Error("No se pudieron cargar los libros");
    }

    return response.json();
}

export async function getBookById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`);

    if (!response.ok) {
        throw new Error("No se pudo cargar el libro");
    }

    return response.json();
}