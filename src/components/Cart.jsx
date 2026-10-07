import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext.jsx"

function Cart() {
    const { cart, removeFromCart } = useCart()
    const navigate = useNavigate()

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <aside className="cart">
            <h2>Carrito</h2>

            {cart.length === 0 ? (
                <p>El carrito está vacío.</p>
            ) : (
                <>
                    <p>Total de libros: {totalItems}</p>

                    {cart.map((book) => (
                        <div key={book.id} className="cart-item">
                            <strong>{book.title}</strong>
                            <p>Cantidad: {book.quantity}</p>

                            <button onClick={() => removeFromCart(book.id)}>
                                Eliminar
                            </button>
                        </div>
                    ))}

                    <button onClick={() => navigate("/checkout")}>
                        Proceder al checkout
                    </button>
                </>
            )}
        </aside>
    )
}

export default Cart