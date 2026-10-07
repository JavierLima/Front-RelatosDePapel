import { useState, useEffect, useMemo } from 'react'
import { getBooks } from '../api/booksApi'
import SearchBar from '../components/SearchBar.jsx'
import BookList from '../components/BookList'
import Cart from "../components/Cart.jsx"
import GenreFilter from '../components/GenreFilter.jsx'

function HomePage() {
    const [search, setSearch] = useState('')
    const [bookList, setBookList] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedGenres, setSelectedGenres] = useState([])

    useEffect(() => {
        getBooks()
            .then((data) => {
                setBookList(data)
            })
            .catch((error) => {
                console.error('Error cargando libros:', error)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const genres = useMemo(
        () => [...new Set(bookList.map((book) => book.category))],
        [bookList]
    )

    const toggleGenre = (category) => {
        setSelectedGenres((prev) =>
            prev.includes(category) ? prev.filter((g) => g !== category) : [...prev, category]
        )
    }

    const filteredBooks = bookList.filter((book) => {
        const matchesSearch = book.title.toLowerCase().includes(search.trim().toLowerCase())
        const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(book.category)
        return matchesSearch && matchesGenre
    })

    return (
        <div className="app">
            <header className="header">
                <h1>Relatos de Papel</h1>
                <SearchBar search={search} setSearch={setSearch} />
            </header>

            <div className="page-layout">
                <GenreFilter
                    genres={genres}
                    selectedGenres={selectedGenres}
                    onToggle={toggleGenre}
                />

                <main className="book-list">
                    {loading ? (
                        <p>Cargando libros...</p>
                    ) : (
                        <>
                            <BookList books={filteredBooks} />
                            {filteredBooks.length === 0 && (
                                <p>No se encontraron libros.</p>
                            )}
                        </>
                    )}
                </main>

                <Cart />
            </div>
        </div>
    )
}

export default HomePage