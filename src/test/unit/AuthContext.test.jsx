import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AuthProvider, useAuth } from '../../context/AuthContext'

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

describe('AuthContext', () => {
    it('estado inicial es null cuando localStorage está vacío', () => {
        const { result } = renderHook(() => useAuth(), { wrapper })
        expect(result.current.user).toBeNull()
    })

    it('recupera el usuario desde localStorage al iniciar', () => {
        const user = { id: 1, name: 'Test', email: 'test@test.com' }
        localStorage.setItem('user', JSON.stringify(user))
        const { result } = renderHook(() => useAuth(), { wrapper })
        expect(result.current.user).toEqual(user)
    })

    it('login guarda el usuario en el estado', () => {
        const { result } = renderHook(() => useAuth(), { wrapper })
        const user = { id: 1, name: 'Test', email: 'test@test.com' }
        act(() => result.current.login(user))
        expect(result.current.user).toEqual(user)
    })

    it('login persiste el usuario en localStorage', () => {
        const { result } = renderHook(() => useAuth(), { wrapper })
        const user = { id: 1, name: 'Test', email: 'test@test.com' }
        act(() => result.current.login(user))
        expect(JSON.parse(localStorage.getItem('user'))).toEqual(user)
    })

    it('logout pone el estado a null', () => {
        const user = { id: 1, name: 'Test' }
        localStorage.setItem('user', JSON.stringify(user))
        const { result } = renderHook(() => useAuth(), { wrapper })
        act(() => result.current.logout())
        expect(result.current.user).toBeNull()
    })

    it('logout elimina el usuario de localStorage', () => {
        const user = { id: 1, name: 'Test' }
        localStorage.setItem('user', JSON.stringify(user))
        const { result } = renderHook(() => useAuth(), { wrapper })
        act(() => result.current.logout())
        expect(localStorage.getItem('user')).toBeNull()
    })
})