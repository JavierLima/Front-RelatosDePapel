import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CartProvider, useCart } from '../../context/CartContext'

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>

const mockBook = { id: 1, title: 'Test', author: 'Autor', price: 10.00, code: 'LIB-001' }
const mockBook2 = { id: 2, title: 'Test 2', author: 'Autor 2', price: 15.00, code: 'LIB-002' }

describe('CartContext', () => {
    describe('addToCart', () => {
        it('añade un libro nuevo al carrito con quantity 1', () => {
            const { result } = renderHook(() => useCart(), { wrapper })
            act(() => result.current.addToCart(mockBook))
            expect(result.current.cart).toHaveLength(1)
            expect(result.current.cart[0].quantity).toBe(1)
        })

        it('incrementa la cantidad si el libro ya existe en el carrito', () => {
            const { result } = renderHook(() => useCart(), { wrapper })
            act(() => result.current.addToCart(mockBook))
            act(() => result.current.addToCart(mockBook))
            expect(result.current.cart).toHaveLength(1)
            expect(result.current.cart[0].quantity).toBe(2)
        })

        it('no mezcla libros distintos', () => {
            const { result } = renderHook(() => useCart(), { wrapper })
            act(() => result.current.addToCart(mockBook))
            act(() => result.current.addToCart(mockBook2))
            expect(result.current.cart).toHaveLength(2)
        })

        it('persiste el carrito en localStorage', () => {
            const { result } = renderHook(() => useCart(), { wrapper })
            act(() => result.current.addToCart(mockBook))
            const stored = JSON.parse(localStorage.getItem('cart'))
            expect(stored).toHaveLength(1)
            expect(stored[0].id).toBe(mockBook.id)
        })
    })

    describe('removeFromCart', () => {
        it('elimina el libro correcto del carrito', () => {
            const { result } = renderHook(() => useCart(), { wrapper })
            act(() => result.current.addToCart(mockBook))
            act(() => result.current.addToCart(mockBook2))
            act(() => result.current.removeFromCart(mockBook.id))
            expect(result.current.cart).toHaveLength(1)
            expect(result.current.cart[0].id).toBe(mockBook2.id)
        })

        it('no falla al eliminar un id que no existe', () => {
            const { result } = renderHook(() => useCart(), { wrapper })
            act(() => result.current.addToCart(mockBook))
            act(() => result.current.removeFromCart(999))
            expect(result.current.cart).toHaveLength(1)
        })
    })

    describe('clearCart', () => {
        it('vacía el array del carrito', () => {
            const { result } = renderHook(() => useCart(), { wrapper })
            act(() => result.current.addToCart(mockBook))
            act(() => result.current.clearCart())
            expect(result.current.cart).toHaveLength(0)
        })

        it('limpia el carrito de localStorage', () => {
            const { result } = renderHook(() => useCart(), { wrapper })
            act(() => result.current.addToCart(mockBook))
            act(() => result.current.clearCart())
            expect(JSON.parse(localStorage.getItem('cart'))).toHaveLength(0)
        })
    })

    describe('addOrder', () => {
        it('crea un pedido con el total calculado correctamente', () => {
            const { result } = renderHook(() => useCart(), { wrapper })
            const items = [
                { ...mockBook, quantity: 2 },
                { ...mockBook2, quantity: 1 },
            ]
            act(() => result.current.addOrder(items))
            expect(result.current.orders[0].total).toBe(35.00)
        })

        it('guarda la fecha y los items en el pedido', () => {
            const { result } = renderHook(() => useCart(), { wrapper })
            const items = [{ ...mockBook, quantity: 1 }]
            act(() => result.current.addOrder(items))
            expect(result.current.orders[0].items).toEqual(items)
            expect(result.current.orders[0].date).toBeDefined()
        })

        it('añade el pedido más reciente al principio del array', () => {
            const { result } = renderHook(() => useCart(), { wrapper })
            act(() => result.current.addOrder([{ ...mockBook, quantity: 1 }]))
            act(() => result.current.addOrder([{ ...mockBook2, quantity: 1 }]))
            expect(result.current.orders[0].items[0].id).toBe(mockBook2.id)
        })

        it('trunca el historial a 5 pedidos máximo', () => {
            const { result } = renderHook(() => useCart(), { wrapper })
            for (let i = 0; i < 6; i++) {
                act(() => result.current.addOrder([{ ...mockBook, quantity: 1 }]))
            }
            expect(result.current.orders).toHaveLength(5)
        })

        it('persiste los pedidos en localStorage', () => {
            const { result } = renderHook(() => useCart(), { wrapper })
            act(() => result.current.addOrder([{ ...mockBook, quantity: 1 }]))
            const stored = JSON.parse(localStorage.getItem('orders'))
            expect(stored).toHaveLength(1)
        })

        it('recupera los pedidos de localStorage al iniciar', () => {
            const orders = [{ id: 1, date: '01/01/2025', items: [], total: 0 }]
            localStorage.setItem('orders', JSON.stringify(orders))
            const { result } = renderHook(() => useCart(), { wrapper })
            expect(result.current.orders).toHaveLength(1)
        })
    })
})