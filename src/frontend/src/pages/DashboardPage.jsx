import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from '../components/LanguageSwitcher';

function DashboardPage() {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we just logged in
    const justLoggedIn = location.state?.justLoggedIn;

    const [showWelcome, setShowWelcome] = useState(justLoggedIn || false);
    const [showContent, setShowContent] = useState(!justLoggedIn);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!justLoggedIn) return;

        const welcomeTimer = setTimeout(() => setShowWelcome(false), 1800);
        const contentTimer = setTimeout(() => setShowContent(true), 2400);

        // Clear the state so a page refresh doesn't replay the animation
        window.history.replaceState({}, document.title);

        return () => { clearTimeout(welcomeTimer); clearTimeout(contentTimer); };
    }, [justLoggedIn]);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    // Determine current title based on route
    const isCalendar = location.pathname.includes('/calendar');
    const headerTitle = isCalendar ? t('dashboard.calendar') : t('dashboard.title');

    // Sidebar nav items with paths mapping to nested routes
    const navItems = [
        {
            key: 'dashboard.title', path: '/dashboard', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
            )
        },
        {
            key: 'dashboard.calendar', path: '/dashboard/calendar', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
            )
        },
    ];

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 relative overflow-hidden flex transition-colors duration-300">

            {/* ═══════ WELCOME OVERLAY ═══════ */}
            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-50 dark:bg-slate-900"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                    >
                        <motion.div
                            className="w-full max-w-sm lg:max-w-md px-6 text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        >
                            <h1 className="text-4xl lg:text-6xl font-bold text-slate-800 dark:text-white tracking-tight break-words">
                                {t('dashboard.hello')} {user?.username} 👋
                            </h1>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════ MOBILE SIDEBAR BACKDROP ═══════ */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* ═══════ SIDEBAR ═══════ */}
            <aside
                className={`fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-950 z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 shadow-2xl lg:shadow-none`}
            >
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                <div className="relative px-6 py-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-white font-bold text-lg tracking-tight">Dashboard</span>
                    </div>
                </div>

                <nav className="relative flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/');
                        return (
                            <button
                                key={item.key}
                                onClick={() => {
                                    navigate(item.path);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${isActive
                                    ? 'bg-white/15 text-white shadow-lg shadow-blue-900/20'
                                    : 'text-blue-200 hover:bg-white/8 hover:text-white'
                                    }`}
                            >
                                {item.icon}
                                {t(item.key)}
                            </button>
                        );
                    })}
                </nav>

                <div className="relative px-4 py-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/15 hover:text-red-200 transition-all duration-200 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        {t('dashboard.signOut')}
                    </button>
                </div>
            </aside>

            {/* ═══════ MAIN CONTENT SHELL ═══════ */}
            <div className="lg:ml-64 flex-1 flex flex-col min-w-0 transition-all duration-300">

                {/* Top panel */}
                <motion.header
                    className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700/50 px-4 lg:px-8 py-4 flex items-center justify-between shadow-sm transition-colors duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showWelcome ? 0 : 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-lg lg:text-xl font-bold text-slate-800 dark:text-white truncate">{headerTitle}</h1>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-5">
                        <div className="block">
                            <LanguageSwitcher theme="dashboard" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.username}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                    {t('dashboard.emailRole').replace('{{email}}', user?.email).replace('{{role}}', user?.role)}
                                </p>
                            </div>
                            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                                {user?.username?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                        </div>
                    </div>
                </motion.header>

                {/* Outlet for nested routes */}
                <motion.main
                    className="p-4 lg:p-8 flex-1 overflow-x-hidden overflow-y-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 10 }}
                    transition={{ duration: 0.6 }}
                >
                    <Outlet />
                </motion.main>
            </div>
        </div>
    );
}

export default DashboardPage;
