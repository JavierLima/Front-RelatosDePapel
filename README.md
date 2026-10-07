# Relatos de Papel

Aplicación web SPA de una librería ficticia. Permite explorar un catálogo de libros, añadirlos al carrito, completar el proceso de compra y consultar el historial de pedidos desde el perfil de usuario.

---

## Stack tecnológico

| Herramienta | Versión | Uso |
|---|---|---|
| React | 19 | UI y componentes funcionales |
| React Router DOM | 7 | Enrutamiento SPA |
| Vite | 8 | Bundler y servidor de desarrollo |
| ESLint | 9 | Linting con plugins react-hooks y react-refresh |
| Vitest | 4 | Test runner |
| React Testing Library | 16 | Tests de componentes |

Sin TypeScript activo, sin librería de estilos externa.

---

## Instalación y arranque

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Tests
npm test

# Linter
npm run lint
```

---

## Credenciales de acceso (datos mock)

```
Email:      jlima@libreria.com
Contraseña: 1234
```

---

## Rutas de la aplicación

| Ruta | Página | Protegida |
|---|---|---|
| `/` | Landing — bienvenida con acceso a login o catálogo | No |
| `/login` | Formulario de inicio de sesión | No |
| `/home` | Catálogo con búsqueda, filtros y carrito lateral | No |
| `/books/:id` | Detalle de libro + botón añadir al carrito | No |
| `/profile` | Perfil de usuario + últimos 5 pedidos | Sí |
| `/checkout` | Resumen del carrito y pago | Sí |

Las rutas protegidas redirigen a `/login` si no hay sesión activa.

---

## Estructura del proyecto

```
src/
├── api/
│   └── booksApi.js          # Capa de acceso a datos: getBooks(), getBookById(id)
├── assets/                  # Imágenes estáticas (logo, hero, svgs)
├── components/
│   ├── BookCard.jsx         # Tarjeta de libro: título, autor, código, precio
│   ├── BookDetail.jsx       # Detalle de libro + botón añadir al carrito + carrito lateral
│   ├── BookList.jsx         # Lista de BookCards con enlace a /books/:id
│   ├── Cart.jsx             # Carrito lateral: items, eliminar, ir a checkout
│   ├── GenreFilter.jsx      # Filtro por género con checkboxes (multi-selección)
│   ├── Header.jsx           # Cabecera global: logo + título + nav
│   ├── ProtectedRoute.jsx   # Redirige a /login si no hay sesión
│   └── SearchBar.jsx        # Input controlado para búsqueda por título
├── context/
│   ├── AuthContext.jsx      # Estado global de autenticación + persistencia localStorage
│   └── CartContext.jsx      # Estado global del carrito + pedidos + persistencia localStorage
├── data/
│   ├── books.js             # 20 libros mock
│   └── users.js             # 1 usuario mock
├── pages/
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── HomePage.jsx
│   ├── ProfilePage.jsx
│   └── CheckoutPage.jsx
├── App.jsx                  # Providers (Auth > Cart > Router) + rutas
├── main.jsx                 # Punto de entrada (StrictMode)
└── index.css                # Variables CSS globales + tema claro/oscuro
```

---

## Estado global

### AuthContext
- **Estado:** `user` — objeto `{ id, name, email, password }` o `null`
- **Persistencia:** `localStorage` clave `'user'`
- **Métodos:** `login(userData)`, `logout()`
- **Hook:** `useAuth()`

### CartContext
- **Estado cart:** array de `{ ...book, quantity }`
- **Estado orders:** array de hasta 5 pedidos `{ id, date, items, total }`
- **Persistencia:** `localStorage` claves `'cart'` y `'orders'`
- **Métodos cart:** `addToCart(book)`, `removeFromCart(bookId)`, `clearCart()`
- **Métodos orders:** `addOrder(cartItems)` — calcula total y trunca a 5 pedidos
- **Hook:** `useCart()`

---

## Flujo principal

```
/ (Landing)
  ├── Si autenticado → redirige a /home
  └── Si no → botones hacia /login o /home

/login
  └── Valida contra users.js → login() → /profile

/home
  ├── Búsqueda por título
  ├── Filtro por géneros (multi-selección)
  └── Carrito lateral

/books/:id
  └── addToCart(book) → carrito lateral

/checkout
  └── handlePayment: addOrder() → clearCart() → /home

/profile
  └── Datos del usuario + últimos 5 pedidos
```

---

## Modelo de datos

### Libro
```text
{
  id: Number,
  code: String,    // "LIB-001" ... "LIB-020"
  title: String,
  author: String,
  year: Number,
  genre: String,
  price: Number,   // en euros
  image: String    // URL portada
}
```

### Pedido
```text
{
  id: Number,      // Date.now()
  date: String,    // toLocaleDateString('es-ES')
  items: Array,    // snapshot del carrito en el momento del pago
  total: Number
}
```

---

## Notas de desarrollo

- La búsqueda filtra únicamente por título.
- La capa `api/` devuelve Promises aunque los datos sean locales, para simular asincronía.
- Los `console.log()` existentes son intencionales.
- Los estilos son CSS plano con variables globales en `index.css`. Soporta tema claro/oscuro mediante `prefers-color-scheme`.
- No hay backend: todos los datos son mock y la persistencia se gestiona con `localStorage`.
