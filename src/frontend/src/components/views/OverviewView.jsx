import { useLanguage } from '../../i18n/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function OverviewView() {
    const { t } = useLanguage();
    const navigate = useNavigate();

    return (
        <div className="h-full">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 transition-colors">
                Suggestions
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div
                    onClick={() => navigate('/dashboard/calendar')}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden group"
                >
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {t('dashboard.calendar')}
                    </p>

                    <div className="mt-8 inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        {t('dashboard.openCalendar')}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OverviewView;

