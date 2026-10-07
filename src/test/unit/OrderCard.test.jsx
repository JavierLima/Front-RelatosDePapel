import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import OrderCard from '../../components/OrderCard'

const mockOrder = {
    id: 1,
    date: '08/05/2026',
    total: 35.00,
    items: [
        { id: 1, title: 'Cien años de soledad', price: 18.99, quantity: 1 },
        { id: 2, title: 'El Quijote', price: 16.01, quantity: 1 },
    ],
}

describe('OrderCard', () => {
    it('renderiza la fecha del pedido', () => {
        render(<OrderCard order={mockOrder} />)
        expect(screen.getByText(/08\/05\/2026/)).toBeInTheDocument()
    })

    it('renderiza el total del pedido formateado', () => {
        render(<OrderCard order={mockOrder} />)
        expect(screen.getByText('35.00 €')).toBeInTheDocument()
    })

    it('renderiza el título de cada item', () => {
        render(<OrderCard order={mockOrder} />)
        expect(screen.getByText(/Cien años de soledad/)).toBeInTheDocument()
        expect(screen.getByText(/El Quijote/)).toBeInTheDocument()
    })

    it('renderiza la cantidad de cada item', () => {
        render(<OrderCard order={mockOrder} />)
        const items = screen.getAllByRole('listitem')
        items.forEach(item => expect(item).toHaveTextContent('× 1'))
    })

    it('renderiza el precio de línea de cada item formateado', () => {
        render(<OrderCard order={mockOrder} />)
        expect(screen.getByText('18.99 €')).toBeInTheDocument()
        expect(screen.getByText('16.01 €')).toBeInTheDocument()
    })

    it('renderiza el número correcto de items en la lista', () => {
        render(<OrderCard order={mockOrder} />)
        expect(screen.getAllByRole('listitem')).toHaveLength(mockOrder.items.length)
    })

    it('renderiza el precio de línea multiplicado por la cantidad', () => {
        const orderConCantidad = {
            ...mockOrder,
            items: [{ id: 1, title: 'Test', price: 10.00, quantity: 3 }],
        }
        render(<OrderCard order={orderConCantidad} />)
        expect(screen.getByText('30.00 €')).toBeInTheDocument()
    })
})
