import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function DashboardPage() {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* The text element moves organically using Framer layout engine values */}
            <motion.div
                className="absolute"
                initial={{
                    top: "50%",
                    left: "50%",
                    x: "-50%",
                    y: "-50%",
                    scale: 1.5
                }}
                animate={{
                    top: "3rem",
                    left: "3rem",
                    x: "0%",
                    y: "0%",
                    scale: 0.8
                }}
                transition={{
                    duration: 1.5,
                    ease: [0.76, 0, 0.24, 1], // Smooth custom easing
                    delay: 0.2
                }}
                style={{ originX: 0, originY: 0 }}
            >
                <h1 className="text-4xl md:text-6xl font-bold text-slate-800 tracking-tight whitespace-nowrap">
                    {t('dashboard.hello')} {user?.username} 👋
                </h1>

                {/* Fade in the descriptive items neatly after transition finishes */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    className="mt-4 space-y-4"
                >
                    <p className="text-slate-500 text-xl">
                        {t('dashboard.emailRole').replace('{{email}}', user?.email).replace('{{role}}', user?.role)}
                    </p>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                        {t('dashboard.signOut')}
                    </button>
                </motion.div>

            </motion.div>
        </div>
    );
}

export default DashboardPage;
