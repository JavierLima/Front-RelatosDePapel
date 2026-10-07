import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getRecentOrders } from "../api/ordersApi"
import OrderCard from "../components/OrderCard"
import Cart from "../components/Cart"

function ProfilePage() {
    const { user } = useAuth()

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function loadOrders() {
            if (!user?.id) {
                setLoading(false)
                return
            }

            try {
                const data = await getRecentOrders(user.id)
                setOrders(data)
            } catch (err) {
                setError("No se pudieron cargar los pedidos.")
            } finally {
                setLoading(false)
            }
        }

        loadOrders()
    }, [user])

    return (
        <div className="page-layout">
            <div className="profile-page">
                <h1>Mi perfil</h1>
                <Link to="/home">← Ir al inicio</Link>

                <section>
                    <h2>Datos del usuario</h2>
                    <p><strong>Nombre:</strong> {user?.fullName || user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                </section>

                <section>
                    <h2>Últimos pedidos</h2>

                    {loading && <p>Cargando pedidos...</p>}

                    {error && <p style={{ color: "red" }}>{error}</p>}

                    {!loading && !error && orders.length === 0 && (
                        <p>No has realizado ningún pedido todavía.</p>
                    )}

                    {!loading && !error && orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </section>
            </div>

            <Cart />
        </div>
    )
}

export default ProfilePage