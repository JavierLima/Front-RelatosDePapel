import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import GenreFilter from '../../components/GenreFilter'

const genres = ['Fantasía', 'Terror', 'Thriller']

describe('GenreFilter', () => {
    it('renderiza todos los géneros recibidos', () => {
        render(<GenreFilter genres={genres} selectedGenres={[]} onToggle={() => {}} />)
        expect(screen.getByText('Fantasía')).toBeInTheDocument()
        expect(screen.getByText('Terror')).toBeInTheDocument()
        expect(screen.getByText('Thriller')).toBeInTheDocument()
    })

    it('los checkboxes aparecen desmarcados cuando selectedGenres está vacío', () => {
        render(<GenreFilter genres={genres} selectedGenres={[]} onToggle={() => {}} />)
        const checkboxes = screen.getAllByRole('checkbox')
        checkboxes.forEach((cb) => expect(cb).not.toBeChecked())
    })

    it('marca el checkbox del género seleccionado', () => {
        render(<GenreFilter genres={genres} selectedGenres={['Terror']} onToggle={() => {}} />)
        const checkboxes = screen.getAllByRole('checkbox')
        expect(checkboxes[1]).toBeChecked()
    })

    it('llama a onToggle con el género al hacer clic en un checkbox', async () => {
        const onToggle = vi.fn()
        render(<GenreFilter genres={genres} selectedGenres={[]} onToggle={onToggle} />)
        await userEvent.click(screen.getAllByRole('checkbox')[0])
        expect(onToggle).toHaveBeenCalledWith('Fantasía')
    })

    it('llama a onToggle para desmarcar un género ya seleccionado', async () => {
        const onToggle = vi.fn()
        render(<GenreFilter genres={genres} selectedGenres={['Terror']} onToggle={onToggle} />)
        await userEvent.click(screen.getAllByRole('checkbox')[1])
        expect(onToggle).toHaveBeenCalledWith('Terror')
    })
})