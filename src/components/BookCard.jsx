import PriceTag from './PriceTag'

function BookCard({ book }) {
    return (
        <div className="book-card">
            <h2>{book.title}</h2>
            <p><strong>Autor:</strong> {book.author}</p>
            <p><strong>Código:</strong> {book.code}</p>
            <p><strong>Precio:</strong> <PriceTag price={book.price} /></p>
        </div>
    )
}

export default BookCard