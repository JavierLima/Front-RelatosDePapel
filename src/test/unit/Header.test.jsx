import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { CartProvider } from '../../context/CartContext'
import Header from '../../components/Header'

function renderHeader(user = null) {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    return render(
        <AuthProvider>
            <CartProvider>
                <MemoryRouter>
                    <Header />
                </MemoryRouter>
            </CartProvider>
        </AuthProvider>
    )
}

describe('Header', () => {
    it('muestra el botón de iniciar sesión cuando no hay usuario', () => {
        renderHeader(null)
        expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
    })

    it('no muestra el botón de cerrar sesión cuando no hay usuario', () => {
        renderHeader(null)
        expect(screen.queryByText('Cerrar sesión')).not.toBeInTheDocument()
    })

    it('muestra el nombre del usuario cuando está autenticado', () => {
        renderHeader({ id: 1, name: 'Javier Lima', email: 'test@test.com' })
        expect(screen.getByText('Javier Lima')).toBeInTheDocument()
    })

    it('muestra el botón de cerrar sesión cuando hay usuario', () => {
        renderHeader({ id: 1, name: 'Javier Lima' })
        expect(screen.getByText('Cerrar sesión')).toBeInTheDocument()
    })

    it('no muestra el botón de iniciar sesión cuando hay usuario', () => {
        renderHeader({ id: 1, name: 'Javier Lima' })
        expect(screen.queryByText('Iniciar sesión')).not.toBeInTheDocument()
    })

    it('muestra el nombre de la aplicación', () => {
        renderHeader()
        expect(screen.getByText('Relatos de Papel')).toBeInTheDocument()
    })
})