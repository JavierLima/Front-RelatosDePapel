import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { CartProvider } from '../../context/CartContext'
import ProtectedRoute from '../../components/ProtectedRoute'

function renderProtectedRoute(user = null) {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    return render(
        <AuthProvider>
            <CartProvider>
                <MemoryRouter initialEntries={['/protected']}>
                    <Routes>
                        <Route path="/login" element={<p>Página de login</p>} />
                        <Route
                            path="/protected"
                            element={
                                <ProtectedRoute>
                                    <p>Contenido protegido</p>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </MemoryRouter>
            </CartProvider>
        </AuthProvider>
    )
}

describe('ProtectedRoute', () => {
    it('redirige a /login cuando no hay usuario autenticado', () => {
        renderProtectedRoute(null)
        expect(screen.getByText('Página de login')).toBeInTheDocument()
    })

    it('no muestra el contenido protegido cuando no hay usuario', () => {
        renderProtectedRoute(null)
        expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
    })

    it('renderiza los children cuando hay usuario autenticado', () => {
        renderProtectedRoute({ id: 1, name: 'Test' })
        expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
    })

    it('no redirige a login cuando hay usuario autenticado', () => {
        renderProtectedRoute({ id: 1, name: 'Test' })
        expect(screen.queryByText('Página de login')).not.toBeInTheDocument()
    })
})