import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { CartProvider } from '../../context/CartContext'
import LoginPage from '../../pages/LoginPage'

function renderLogin() {
    const result = render(
        <AuthProvider>
            <CartProvider>
                <MemoryRouter initialEntries={['/login']}>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/profile" element={<p>Perfil del usuario</p>} />
                    </Routes>
                </MemoryRouter>
            </CartProvider>
        </AuthProvider>
    )
    const emailInput = result.container.querySelector('input[type="email"]')
    const passwordInput = result.container.querySelector('input[type="password"]')
    return { ...result, emailInput, passwordInput }
}

describe('LoginPage', () => {
    it('renderiza el formulario de login', () => {
        const { emailInput, passwordInput } = renderLogin()
        expect(emailInput).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
    })

    it('muestra error con credenciales incorrectas', async () => {
        const { emailInput, passwordInput } = renderLogin()
        await userEvent.type(emailInput, 'malo@test.com')
        await userEvent.type(passwordInput, 'wrongpass')
        await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
        expect(screen.getByText('Email o contraseña incorrectos')).toBeInTheDocument()
    })

    it('no muestra error cuando el formulario está vacío al cargar', () => {
        renderLogin()
        expect(screen.queryByText('Email o contraseña incorrectos')).not.toBeInTheDocument()
    })

    it('navega a /profile con credenciales correctas', async () => {
        const { emailInput, passwordInput } = renderLogin()
        await userEvent.type(emailInput, 'jlima@libreria.com')
        await userEvent.type(passwordInput, '1234')
        await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
        expect(screen.getByText('Perfil del usuario')).toBeInTheDocument()
    })

    it('guarda el usuario en localStorage al hacer login correcto', async () => {
        const { emailInput, passwordInput } = renderLogin()
        await userEvent.type(emailInput, 'jlima@libreria.com')
        await userEvent.type(passwordInput, '1234')
        await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
        expect(localStorage.getItem('user')).not.toBeNull()
    })

    it('no navega a /profile con contraseña incorrecta', async () => {
        const { emailInput, passwordInput } = renderLogin()
        await userEvent.type(emailInput, 'jlima@libreria.com')
        await userEvent.type(passwordInput, 'wrongpass')
        await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
        expect(screen.queryByText('Perfil del usuario')).not.toBeInTheDocument()
    })
})