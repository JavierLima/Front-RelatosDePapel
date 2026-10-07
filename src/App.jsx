import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {AuthProvider} from "./context/AuthContext.jsx";
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import LoginPage from "./pages/LoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import BookList from "./components/BookList";
import BookDetail from "./components/BookDetail";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Header from "./components/Header.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import SupportChatPage from "./pages/SupportChatPage.jsx"

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <Header />
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/books" element={<BookList />} />
                        <Route path="/books/:id" element={<BookDetail />} />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/support"
                            element={
                                <ProtectedRoute>
                                    <SupportChatPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/checkout"
                            element={
                                <ProtectedRoute>
                                    <CheckoutPage />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    )
}

export default App