import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/Relatos_de_papel_logo.png'

function Header() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <header className="site-header">
            <span onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
                <img src={logo} alt="Logo" style={{ height: '2rem', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                Relatos de Papel
            </span>

            <nav>
                <Link to="/support">Atención al cliente</Link>

                {user ? (
                    <>
                        <span onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                            {user.fullName || user.name}
                        </span>
                        <button onClick={handleLogout}>Cerrar sesión</button>
                    </>
                ) : (
                    <button onClick={() => navigate('/login')}>Iniciar sesión</button>
                )}
            </nav>
        </header>
    )
}

export default Header