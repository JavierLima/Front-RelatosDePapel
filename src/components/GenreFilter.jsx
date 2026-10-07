function GenreFilter({ genres, selectedGenres, onToggle }) {
    return (
        <aside className="genre-filter">
            <h3>Géneros</h3>

            <ul className="genre-list">
                {genres.map((genre) => (
                    <li key={genre}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedGenres.includes(genre)}
                                onChange={() => onToggle(genre)}
                            />
                            {genre}
                        </label>
                    </li>
                ))}
            </ul>
        </aside>
    )
}

export default GenreFilter