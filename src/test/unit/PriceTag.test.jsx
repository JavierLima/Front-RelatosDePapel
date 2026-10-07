import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PriceTag from '../../components/PriceTag'

describe('PriceTag', () => {
    it('renderiza el precio con dos decimales y símbolo €', () => {
        render(<PriceTag price={18.99} />)
        expect(screen.getByText('18.99 €')).toBeInTheDocument()
    })

    it('formatea un precio entero añadiendo los dos decimales', () => {
        render(<PriceTag price={10} />)
        expect(screen.getByText('10.00 €')).toBeInTheDocument()
    })

    it('formatea un precio con un solo decimal', () => {
        render(<PriceTag price={9.9} />)
        expect(screen.getByText('9.90 €')).toBeInTheDocument()
    })

    it('aplica la clase price-tag al elemento', () => {
        const { container } = render(<PriceTag price={5} />)
        expect(container.firstChild).toHaveClass('price-tag')
    })
})
