import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'

export function renderWithProviders(ui, { initialEntries = ['/'] } = {}) {
    return render(
        <AuthProvider>
            <CartProvider>
                <MemoryRouter initialEntries={initialEntries}>
                    {ui}
                </MemoryRouter>
            </CartProvider>
        </AuthProvider>
    )
}

export function renderWithAuth(ui, { user = null } = {}) {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    return renderWithProviders(ui)
}