# CLAUDE.md — LibraryReact

## Reglas de desarrollo (leer siempre antes de actuar)

1. **No modificar la lógica del proyecto** a no ser que sea estrictamente necesario por una dependencia o un bug crítico que rompa la funcionalidad. Los cambios de lógica deben estar justificados explícitamente.
2. **Pedir aprobación antes de cada cambio**. Antes de editar cualquier archivo, describir qué se va a cambiar y por qué, y esperar confirmación del usuario.
3. **Leer la carpeta `skills/`** en su totalidad antes de intentar cualquier cambio en el proyecto. Si la carpeta no existe, indicárselo al usuario antes de continuar.

---

## Stack tecnológico

- **React 19** — componentes funcionales, hooks
- **React Router DOM v7** — enrutamiento SPA con `BrowserRouter`
- **Vite 8** — bundler y servidor de desarrollo (`npm run dev`)
- **ESLint 9** — con plugins `react-hooks` y `react-refresh`
- Sin TypeScript (tipos instalados pero no usados), sin librería de estilos externa

---

## Estructura del proyecto

```
src/
├── api/
│   └── booksApi.js          # Capa de acceso a datos: getBooks(), getBookById(id)
├── assets/                  # Imágenes estáticas (hero.png, svgs)
├── components/
│   ├── BookCard.jsx         # Tarjeta de libro: title, author, code, price
│   ├── BookDetail.jsx       # Detalle de libro + botón añadir al carrito + Cart lateral
│   ├── BookList.jsx         # Lista de BookCards envueltas en Link a /books/:id
│   ├── Cart.jsx             # Carrito lateral: items, eliminar, ir a checkout
│   ├── GenreFilter.jsx      # Filtro por género con checkboxes (multi-selección)
│   ├── Header.jsx           # Cabecera global: título + nav (login/logout + perfil)
│   ├── ProtectedRoute.jsx   # Redirige a /login si no hay usuario autenticado
│   └── SearchBar.jsx        # Input controlado para búsqueda por título
├── context/
│   ├── AuthContext.jsx      # Estado global de autenticación + persistencia localStorage
│   └── CartContext.jsx      # Estado global del carrito + pedidos + persistencia localStorage
├── data/
│   ├── books.js             # 20 libros mockeados con id, code, title, author, year, genre, price, image
│   └── users.js             # 1 usuario mockeado: jlima@libreria.com / 1234
├── pages/
│   ├── LandingPage.jsx      # Vista de acceso: redirige a /home si ya autenticado
│   ├── LoginPage.jsx        # Formulario login: valida contra users.js, redirige a /profile
│   ├── HomePage.jsx         # Catálogo: búsqueda + filtro géneros + listado + carrito
│   ├── ProfilePage.jsx      # Perfil protegido: datos usuario + últimos 5 pedidos
│   └── CheckoutPage.jsx     # Checkout protegido: resumen + pago (alert + clearCart + /home)
├── App.jsx                  # Providers (Auth > Cart > Router) + definición de rutas
├── main.jsx                 # Punto de entrada React (StrictMode)
├── index.css                # Variables CSS globales + tema claro/oscuro
└── App.css                  # Estilos heredados del template (no usados activamente)
```

---

## Rutas

| Ruta | Componente | Protegida |
|---|---|---|
| `/` | LandingPage | No |
| `/login` | LoginPage | No |
| `/home` | HomePage | No |
| `/books/:id` | BookDetail | No |
| `/profile` | ProfilePage | Sí |
| `/checkout` | CheckoutPage | Sí |

La ruta `/books` (BookList standalone) existe pero no se usa en navegación activa.

---

## Lógica de estado global

### AuthContext (`src/context/AuthContext.jsx`)
- **Estado:** `user` (objeto `{ id, name, email, password }` o `null`)
- **Persistencia:** `localStorage` clave `'user'`
- **Inicialización:** lazy init desde localStorage al montar
- **Métodos:** `login(userData)`, `logout()`
- **Hook:** `useAuth()`

### CartContext (`src/context/CartContext.jsx`)
- **Estado cart:** array de libros con `{ ...book, quantity }`
- **Estado orders:** array de los últimos 5 pedidos `{ id, date, items, total }`
- **Persistencia:** `localStorage` clave `'cart'` (sincronizado vía `useEffect`) y clave `'orders'`
- **Inicialización:** lazy init desde localStorage para ambos
- **Métodos cart:** `addToCart(book)`, `removeFromCart(bookId)`, `clearCart()`
- **Métodos orders:** `addOrder(cartItems)` — calcula total y guarda, trunca a 5
- **Hook:** `useCart()`

---

## Flujo principal de la aplicación

```
/ (Landing)
  └─ Si autenticado → /home  (useEffect en LandingPage)
  └─ Si no → botones: /login  o  /home

/login
  └─ Valida contra users.js
  └─ login() → localStorage → navigate('/profile')

/home
  └─ Búsqueda por título (SearchBar, estado local)
  └─ Filtro por géneros (GenreFilter, checkboxes multi-selección, estado local)
  └─ Libros filtrados → BookList → BookCard → Link a /books/:id
  └─ Carrito lateral (Cart)

/books/:id
  └─ getBookById(id) desde booksApi
  └─ addToCart(book) — ÚNICO punto de entrada al carrito
  └─ Carrito lateral (Cart)

/checkout (protegida)
  └─ Resumen del carrito con totales
  └─ handlePayment: window.alert → addOrder(cart) → clearCart() → navigate('/home')

/profile (protegida)
  └─ Datos del usuario desde useAuth()
  └─ Últimos 5 pedidos desde useCart()
```

---

## Modelo de datos

### Libro (`src/data/books.js`)
```text
{
  id: Number,
  code: String,      // "LIB-001" ... "LIB-020"
  title: String,
  author: String,
  year: Number,
  genre: String,
  price: Number,     // en euros
  image: String      // URL imagen portada
}
```

### Usuario (`src/data/users.js`)
```text
{
  id: Number,
  name: String,
  email: String,
  password: String   // texto plano (datos mock)
}
```

### Pedido (generado en CartContext)
```text
{
  id: Number,        // Date.now()
  date: String,      // toLocaleDateString('es-ES')
  items: Array,      // snapshot del carrito en el momento del pago
  total: Number      // calculado en addOrder()
}
```

---

## Convenciones del proyecto

- Componentes funcionales únicamente, sin clases
- Un archivo por componente, nombrado en PascalCase
- Hooks custom exportados junto al Provider en el mismo archivo de contexto
- Estilos: CSS plano, sin CSS Modules ni styled-components
- Los `console.log()` existentes se mantienen intencionalmente (decisión del autor)
- La capa `api/` devuelve Promises aunque los datos sean locales, para simular asincronía real
- La búsqueda filtra únicamente por título (por requisito explícito, aunque el campo `code` y `author` existen)