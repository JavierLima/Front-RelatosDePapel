import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { CartProvider } from '../../context/CartContext'
import CheckoutPage from '../../pages/CheckoutPage'

const cartItems = [
    { id: 1, title: 'Libro Uno', author: 'Autor', price: 10.00, quantity: 2 },
    { id: 2, title: 'Libro Dos', author: 'Autor', price: 15.00, quantity: 1 },
]

function renderCheckout(withItems = true) {
    if (withItems) localStorage.setItem('cart', JSON.stringify(cartItems))
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test' }))

    return render(
        <AuthProvider>
            <CartProvider>
                <MemoryRouter initialEntries={['/checkout']}>
                    <Routes>
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/home" element={<p>Página principal</p>} />
                    </Routes>
                </MemoryRouter>
            </CartProvider>
        </AuthProvider>
    )
}

describe('CheckoutPage', () => {
    beforeEach(() => {
        vi.spyOn(window, 'alert').mockImplementation(() => {})
    })

    it('muestra mensaje cuando el carrito está vacío', () => {
        renderCheckout(false)
        expect(screen.getByText('No hay libros en el carrito.')).toBeInTheDocument()
    })

    it('muestra los títulos de los libros del carrito', () => {
        renderCheckout()
        expect(screen.getByText('Libro Uno')).toBeInTheDocument()
        expect(screen.getByText('Libro Dos')).toBeInTheDocument()
    })

    it('muestra el total calculado correctamente', () => {
        renderCheckout()
        expect(screen.getByText(/Total: 35 €/)).toBeInTheDocument()
    })

    it('muestra el botón de proceder al pago', () => {
        renderCheckout()
        expect(screen.getByRole('button', { name: 'Proceder al pago' })).toBeInTheDocument()
    })

    it('muestra un alert al hacer clic en proceder al pago', async () => {
        renderCheckout()
        await userEvent.click(screen.getByRole('button', { name: 'Proceder al pago' }))
        expect(window.alert).toHaveBeenCalledWith('El pedido se ha realizado correctamente')
    })

    it('vacía el carrito en localStorage tras el pago', async () => {
        renderCheckout()
        await userEvent.click(screen.getByRole('button', { name: 'Proceder al pago' }))
        expect(JSON.parse(localStorage.getItem('cart'))).toHaveLength(0)
    })

    it('guarda el pedido en localStorage tras el pago', async () => {
        renderCheckout()
        await userEvent.click(screen.getByRole('button', { name: 'Proceder al pago' }))
        const orders = JSON.parse(localStorage.getItem('orders'))
        expect(orders).toHaveLength(1)
        expect(orders[0].total).toBe(35)
    })

    it('navega a /home tras el pago', async () => {
        renderCheckout()
        await userEvent.click(screen.getByRole('button', { name: 'Proceder al pago' }))
        expect(screen.getByText('Página principal')).toBeInTheDocument()
    })
})
