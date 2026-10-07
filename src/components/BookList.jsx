import { Link } from "react-router-dom"
import BookCard from "./BookCard"

function BookList({ books }) {
    return (
        <div className="book-list">
            {books.map((book) => (
                <Link to={`/books/${book.id}`} key={book.id}>
                    <BookCard book={book} />
                </Link>
            ))}
        </div>
    )
}

export default BookList