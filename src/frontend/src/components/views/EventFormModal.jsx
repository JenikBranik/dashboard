import { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

function EventFormModal({ isOpen, onClose, onSave, onDelete, initialData }) {
    const { t } = useLanguage();

    const [title, setTitle] = useState('');
    const [allDay, setAllDay] = useState(false);
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    // For standardizing datetime-local format into YYYY-MM-DDTHH:MM without seconds
    const formatForInput = (dateStr) => {
        if (!dateStr) return '';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            // Native format is 2026-07-09T14:30
            const local = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
            return local.toISOString().slice(0, 16);
        } catch {
            return dateStr;
        }
    };

    // Format for date-only input
    const formatDateOnly = (dateStr) => {
        if (!dateStr) return '';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            const local = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
            return local.toISOString().split('T')[0];
        } catch {
            return dateStr;
        }
    };

    useEffect(() => {
        if (isOpen && initialData) {
            setTitle('');
            setAllDay(initialData.allDay || false);

            if (initialData.allDay) {
                setStart(initialData.startStr ? formatDateOnly(initialData.startStr) : '');
                setEnd(initialData.endStr ? formatDateOnly(initialData.endStr) : '');
            } else {
                setStart(initialData.startStr ? formatForInput(initialData.startStr) : '');
                setEnd(initialData.endStr ? formatForInput(initialData.endStr) : '');
            }
        } else if (isOpen) {
            // Default when clicking +
            setTitle('');
            setAllDay(false);
            setStart('');
            setEnd('');
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            id: initialData?.id,
            title,
            start,
            end,
            allDay
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] transition-opacity"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg pointer-events-auto overflow-hidden flex flex-col transition-colors duration-300"
                        >
                            <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/80">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                                    {t('dashboard.newEvent')}
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-full transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        {t('dashboard.eventTitle')}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        autoFocus
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        placeholder={t('dashboard.eventTitlePlaceholder')}
                                    />
                                </div>

                                {/* All Day Toggle */}
                                <label className="flex items-center gap-3 cursor-pointer group w-max">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={allDay}
                                            onChange={(e) => setAllDay(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                        {t('dashboard.allDayEvent')}
                                    </span>
                                </label>

                                {/* Date/Time Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            {t('dashboard.startDate')}
                                        </label>
                                        <input
                                            type={allDay ? "date" : "datetime-local"}
                                            required
                                            value={start}
                                            onChange={(e) => setStart(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm [color-scheme:light] dark:[color-scheme:dark]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            {t('dashboard.endDate')}
                                        </label>
                                        <input
                                            type={allDay ? "date" : "datetime-local"}
                                            value={end}
                                            onChange={(e) => setEnd(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm [color-scheme:light] dark:[color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                {/* Footer actions */}
                                <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 mt-6 !mb-0">
                                    <div>
                                        {initialData?.id && (
                                            <button
                                                type="button"
                                                onClick={() => onDelete(initialData.id)}
                                                className="px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                                            >
                                                {t('dashboard.delete')}
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex gap-2 md:gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 md:px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
                                        >
                                            {t('dashboard.cancel')}
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 md:px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all font-semibold"
                                        >
                                            {t('dashboard.saveEvent')}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

export default EventFormModal;
