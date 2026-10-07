import PriceTag from './PriceTag'

function OrderCard({ order }) {
    const date = order.createdAt
        ? new Date(order.createdAt).toLocaleString()
        : "Fecha no disponible"

    return (
        <div className="order-card">
            <p>
                <strong>Pedido #{order.id}</strong> — {date}
            </p>

            <ul>
                <li>
                    {order.bookTitle} × {order.quantity} —{" "}
                    <PriceTag price={order.totalPrice} />
                </li>
            </ul>
        </div>
    )
}

export default OrderCard