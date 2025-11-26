import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const { user, logout } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Don't show navbar on login page
    if (!user) return null;

    return (
        <nav className="glass-dark text-white sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent hidden sm:block">
                            Витрати Юридичної Фірми
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        <NavLink to="/">Головна</NavLink>
                        <NavLink to="/expenses">Витрати</NavLink>
                        <NavLink to="/incomes">Доходи</NavLink>
                        <NavLink to="/clients">Клієнти</NavLink>
                        <NavLink to="/cases">Справи</NavLink>
                        <NavLink to="/report">Звіт</NavLink>
                        <button
                            onClick={handleLogout}
                            className="ml-4 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Вийти
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden mt-4 space-y-2 animate-slide-in">
                        <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Головна</MobileNavLink>
                        <MobileNavLink to="/expenses" onClick={() => setIsOpen(false)}>Витрати</MobileNavLink>
                        <MobileNavLink to="/incomes" onClick={() => setIsOpen(false)}>Доходи</MobileNavLink>
                        <MobileNavLink to="/clients" onClick={() => setIsOpen(false)}>Клієнти</MobileNavLink>
                        <MobileNavLink to="/cases" onClick={() => setIsOpen(false)}>Справи</MobileNavLink>
                        <MobileNavLink to="/report" onClick={() => setIsOpen(false)}>Звіт</MobileNavLink>
                        <button
                            onClick={() => { handleLogout(); setIsOpen(false); }}
                            className="block w-full text-left px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium transition-all duration-200"
                        >
                            Вийти
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

// Desktop Nav Link Component
function NavLink({ to, children }) {
    return (
        <Link
            to={to}
            className="px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium"
        >
            {children}
        </Link>
    );
}

// Mobile Nav Link Component
function MobileNavLink({ to, onClick, children }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className="block px-4 py-3 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
        >
            {children}
        </Link>
    );
}
