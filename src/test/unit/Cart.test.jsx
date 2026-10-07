import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { CartProvider, useCart } from '../../context/CartContext'
import { act, renderHook } from '@testing-library/react'
import Cart from '../../components/Cart'

function renderCart() {
    return render(
        <AuthProvider>
            <CartProvider>
                <MemoryRouter>
                    <Cart />
                </MemoryRouter>
            </CartProvider>
        </AuthProvider>
    )
}

const wrapper = ({ children }) => (
    <AuthProvider>
        <CartProvider>
            <MemoryRouter>
                {children}
            </MemoryRouter>
        </CartProvider>
    </AuthProvider>
)

describe('Cart', () => {
    it('muestra mensaje de carrito vacío cuando no hay items', () => {
        renderCart()
        expect(screen.getByText('El carrito está vacío.')).toBeInTheDocument()
    })

    it('no muestra el botón de checkout cuando el carrito está vacío', () => {
        renderCart()
        expect(screen.queryByText('Proceder al checkout')).not.toBeInTheDocument()
    })

    it('muestra el total de unidades correctamente con varios items', async () => {
        const { result } = renderHook(() => useCart(), { wrapper })
        act(() => result.current.addToCart({ id: 1, title: 'Libro 1', price: 10 }))
        act(() => result.current.addToCart({ id: 1, title: 'Libro 1', price: 10 }))
        act(() => result.current.addToCart({ id: 2, title: 'Libro 2', price: 15 }))

        render(
            <AuthProvider>
                <CartProvider>
                    <MemoryRouter>
                        <Cart />
                    </MemoryRouter>
                </CartProvider>
            </AuthProvider>
        )

        localStorage.setItem('cart', JSON.stringify(result.current.cart))

        render(
            <AuthProvider>
                <CartProvider>
                    <MemoryRouter>
                        <Cart />
                    </MemoryRouter>
                </CartProvider>
            </AuthProvider>
        )

        expect(screen.getAllByText(/Total de libros: 3/)[0]).toBeInTheDocument()
    })

    it('muestra el botón de checkout cuando hay items en el carrito', () => {
        const cartItems = [{ id: 1, title: 'Libro 1', price: 10, quantity: 1 }]
        localStorage.setItem('cart', JSON.stringify(cartItems))

        render(
            <AuthProvider>
                <CartProvider>
                    <MemoryRouter>
                        <Cart />
                    </MemoryRouter>
                </CartProvider>
            </AuthProvider>
        )

        expect(screen.getByText('Proceder al checkout')).toBeInTheDocument()
    })

    it('muestra los títulos de los libros en el carrito', () => {
        const cartItems = [
            { id: 1, title: 'Libro Uno', price: 10, quantity: 1 },
            { id: 2, title: 'Libro Dos', price: 15, quantity: 2 },
        ]
        localStorage.setItem('cart', JSON.stringify(cartItems))

        render(
            <AuthProvider>
                <CartProvider>
                    <MemoryRouter>
                        <Cart />
                    </MemoryRouter>
                </CartProvider>
            </AuthProvider>
        )

        expect(screen.getByText('Libro Uno')).toBeInTheDocument()
        expect(screen.getByText('Libro Dos')).toBeInTheDocument()
    })
})