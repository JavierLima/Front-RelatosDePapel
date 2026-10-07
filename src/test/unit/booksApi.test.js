import { describe, it, expect } from 'vitest'
import { getBooks, getBookById } from '../../api/booksApi'

describe('booksApi', () => {
    describe('getBooks', () => {
        it('devuelve una Promise', () => {
            expect(getBooks()).toBeInstanceOf(Promise)
        })

        it('resuelve con un array de libros', async () => {
            const books = await getBooks()
            expect(Array.isArray(books)).toBe(true)
        })

        it('cada libro tiene los campos requeridos', async () => {
            const books = await getBooks()
            books.forEach((book) => {
                expect(book).toHaveProperty('id')
                expect(book).toHaveProperty('code')
                expect(book).toHaveProperty('title')
                expect(book).toHaveProperty('author')
                expect(book).toHaveProperty('price')
                expect(book).toHaveProperty('genre')
            })
        })
    })

    describe('getBookById', () => {
        it('devuelve el libro correcto por ID numérico', async () => {
            const book = getBookById(1)
            expect(book).toBeDefined()
            expect(book.id).toBe(1)
        })

        it('devuelve el libro correcto por ID como string', () => {
            const book = getBookById('1')
            expect(book).toBeDefined()
            expect(book.id).toBe(1)
        })

        it('devuelve undefined si el ID no existe', () => {
            const book = getBookById(9999)
            expect(book).toBeUndefined()
        })
    })
})
