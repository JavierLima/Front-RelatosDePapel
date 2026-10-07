import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const stored = localStorage.getItem('cart')
        return stored ? JSON.parse(stored) : []
    })

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])
    const [orders, setOrders] = useState(() => {
        const stored = localStorage.getItem('orders')
        return stored ? JSON.parse(stored) : []
    })

    const addOrder = (cartItems) => {
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const newOrder = {
            id: Date.now(),
            date: new Date().toLocaleDateString('es-ES'),
            items: cartItems,
            total,
        }
        setOrders((prev) => {
            const updated = [newOrder, ...prev].slice(0, 5)
            localStorage.setItem('orders', JSON.stringify(updated))
            return updated
        })
    }

    const addToCart = (book) => {
        setCart((prevCart) => {
            const existingBook = prevCart.find((item) => item.id === book.id)

            if (existingBook) {
                return prevCart.map((item) =>
                    item.id === book.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }

            return [...prevCart, { ...book, quantity: 1 }]
        })
    }

    const removeFromCart = (bookId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== bookId))
    }

    const clearCart = () => {
        setCart([])
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, orders, addOrder }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}