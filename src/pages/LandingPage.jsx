import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/Relatos_de_papel_logo.png'

function LandingPage() {
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/home')
        }
    }, [user, navigate])

    return (
        <div className="landing-page">
            <h1>Bienvenido a Relatos de Papel</h1>

            <img src={logo} alt="Logo" style={{ display: 'block', margin: '1rem auto', height: '8rem' }} />

            <button onClick={() => navigate('/login')}>
                Iniciar sesión
            </button>

            <button onClick={() => navigate('/home')}>
                Explorar catálogo
            </button>
        </div>
    )
}

export default LandingPage