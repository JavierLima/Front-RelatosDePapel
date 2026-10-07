import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { CartProvider } from '../../context/CartContext'
import LandingPage from '../../pages/LandingPage'

function renderLanding(user = null) {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    return render(
        <AuthProvider>
            <CartProvider>
                <MemoryRouter initialEntries={['/']}>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/home" element={<p>Página principal</p>} />
                        <Route path="/login" element={<p>Página de login</p>} />
                    </Routes>
                </MemoryRouter>
            </CartProvider>
        </AuthProvider>
    )
}

describe('LandingPage', () => {
    it('muestra el título de bienvenida cuando no hay usuario', () => {
        renderLanding(null)
        expect(screen.getByText(/Relatos de Papel/)).toBeInTheDocument()
    })

    it('muestra el botón de iniciar sesión cuando no hay usuario', () => {
        renderLanding(null)
        expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
    })

    it('muestra el botón de explorar catálogo cuando no hay usuario', () => {
        renderLanding(null)
        expect(screen.getByText('Explorar catálogo')).toBeInTheDocument()
    })

    it('redirige a /home cuando el usuario ya está autenticado', () => {
        renderLanding({ id: 1, name: 'Test' })
        expect(screen.getByText('Página principal')).toBeInTheDocument()
    })

    it('no muestra la landing cuando hay usuario autenticado', () => {
        renderLanding({ id: 1, name: 'Test' })
        expect(screen.queryByText('Explorar catálogo')).not.toBeInTheDocument()
    })
})
