import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as loginRequest } from '../api/authApi'
import logo from '../assets/Relatos_de_papel_logo.png'

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const data = await loginRequest(email, password)

            login(data.user)

            navigate('/profile')
        } catch (err) {
            setError('Email o contraseña incorrectos')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="app">
            <main>
                <form onSubmit={handleSubmit}>
                    <img src={logo} alt="Logo" style={{ display: 'block', margin: '0 auto 1rem', height: '5rem' }} />
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </main>
        </div>
    )
}

export default LoginPage