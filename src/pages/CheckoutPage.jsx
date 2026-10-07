import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext.jsx"
import { createOrder } from "../api/ordersApi.js"

function CheckoutPage() {
    const { cart, clearCart, addOrder } = useCart()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const total = cart.reduce((sum, item) => {
        return sum + (item.price || 0) * (item.quantity || 1)
    }, 0)

    const handlePayment = async () => {
        setLoading(true)
        setError("")

        try {
            const createdOrders = []

            for (const item of cart) {
                const order = await createOrder(item.id, item.quantity || 1)
                createdOrders.push(order)
            }

            window.alert("El pedido se ha realizado correctamente. Recibirás un correo de confirmación.")

            addOrder(createdOrders)
            clearCart()
            navigate("/home")
        } catch (err) {
              setError(err.message || "No se pudo completar el pedido.")
          } finally {
            setLoading(false)
        }
    }

    if (cart.length === 0) {
        return (
            <div className="checkout-page">
                <h1>Checkout</h1>
                <p>No hay libros en el carrito.</p>
            </div>
        )
    }

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>

            <h2>Resumen del pedido</h2>

            {cart.map((book) => (
                <div key={book.id}>
                    <h3>{book.title}</h3>
                    <p>Autor: {book.author}</p>
                    <p>Cantidad: {book.quantity || 1}</p>
                    {book.price && <p>Precio: {book.price} €</p>}
                </div>
            ))}

            <h2>Total: {total.toFixed(2)} €</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button onClick={handlePayment} disabled={loading}>
                {loading ? "Procesando..." : "Proceder al pago"}
            </button>
        </div>
    )
}

export default CheckoutPage