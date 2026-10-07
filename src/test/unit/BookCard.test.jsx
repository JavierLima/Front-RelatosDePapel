import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BookCard from '../../components/BookCard'

const mockBook = {
    id: 1,
    code: 'LIB-001',
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    price: 18.99,
    genre: 'Realismo mágico',
}

describe('BookCard', () => {
    it('renderiza el título del libro', () => {
        render(<BookCard book={mockBook} />)
        expect(screen.getByText('Cien años de soledad')).toBeInTheDocument()
    })

    it('renderiza el autor del libro', () => {
        render(<BookCard book={mockBook} />)
        expect(screen.getByText(/Gabriel García Márquez/)).toBeInTheDocument()
    })

    it('renderiza el código del libro', () => {
        render(<BookCard book={mockBook} />)
        expect(screen.getByText(/LIB-001/)).toBeInTheDocument()
    })

    it('renderiza el precio del libro', () => {
        render(<BookCard book={mockBook} />)
        expect(screen.getByText(/18.99/)).toBeInTheDocument()
    })
})
