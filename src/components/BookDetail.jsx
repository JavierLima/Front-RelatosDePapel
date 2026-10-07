import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getBookById } from "../api/booksApi.js"
import { useCart } from "../context/CartContext.jsx"
import Cart from "../components/Cart.jsx"
import PriceTag from "../components/PriceTag.jsx"

function BookDetail() {
    const { id } = useParams()
    const { addToCart } = useCart()

    const [book, setBook] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function loadBook() {
            try {
                const data = await getBookById(id)
                setBook(data)
            } catch (err) {
                setError("Libro no encontrado")
            } finally {
                setLoading(false)
            }
        }

        loadBook()
    }, [id])

    if (loading) return <p>Cargando libro...</p>
    if (error) return <p>{error}</p>
    if (!book) return <p>Libro no encontrado</p>

    return (
        <div className="page-layout">
            <main>
                <Link to="/home">← Volver</Link>

                <div className="book-detail-content">
                    <img src={book.image} alt={book.title} />

                    <div className="book-detail-info">
                        <h1>{book.title}</h1>
                        <p>Autor: {book.author}</p>
                        <p>Año: {book.publicationDate}</p>
                        <p>Género: {book.category}</p>
                        <p>Precio: <PriceTag price={book.price} /></p>

                        <button onClick={() => addToCart(book)}>
                            Añadir al carrito
                        </button>
                    </div>
                </div>
            </main>

            <Cart />
        </div>
    )
}

export default BookDetail