import '@testing-library/jest-dom'

const createStorage = () => {
    const store = {}
    return {
        getItem: (key) => store[key] ?? null,
        setItem: (key, value) => { store[key] = String(value) },
        removeItem: (key) => { delete store[key] },
        clear: () => { Object.keys(store).forEach(k => delete store[k]) },
        get length() { return Object.keys(store).length },
        key: (n) => Object.keys(store)[n] ?? null,
    }
}

global.localStorage = createStorage()
global.sessionStorage = createStorage()

beforeEach(() => {
    localStorage.clear()
})
