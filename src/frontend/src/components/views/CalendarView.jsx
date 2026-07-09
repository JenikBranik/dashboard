import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { api } from '../../api';

// FullCalendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import csLocale from '@fullcalendar/core/locales/cs';
import enLocale from '@fullcalendar/core/locales/en-gb';

import EventFormModal from './EventFormModal';

function CalendarView() {
    const { t, lang } = useLanguage();
    const [events, setEvents] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialEventData, setInitialEventData] = useState(null);
    const calendarRef = useRef(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [currentView, setCurrentView] = useState('dayGridMonth');

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ── Fetch events from API ──
    const fetchEvents = useCallback(async (info) => {
        try {
            let url = '/api/events';
            if (info) {
                const start = info.startStr || info.start?.toISOString();
                const end = info.endStr || info.end?.toISOString();
                if (start && end) url += `?start=${start}&end=${end}`;
            }
            const data = await api.get(url);
            setEvents(data);
        } catch {
            // silently fail
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // ── Open Modal to Create or Transition View ──
    const handleDateClick = (info) => {
        const api = calendarRef.current?.getApi();

        if (isMobile && api?.view.type === 'dayGridMonth') {
            api.changeView('listDay', info.dateStr);
            return;
        }

        setInitialEventData({
            startStr: info.dateStr,
            allDay: info.allDay
        });
        setIsModalOpen(true);
    };

    const handleFABClick = () => {
        const api = calendarRef.current?.getApi();
        const activeDate = api?.getDate();
        setInitialEventData(activeDate ? { startStr: activeDate.toISOString() } : null);
        setIsModalOpen(true);
    };

    // ── Save event from Modal ──
    const handleSaveEvent = async (eventData) => {
        try {
            if (eventData.id) {
                // Update
                const updatedEvent = await api.put(`/api/events/${eventData.id}`, {
                    title: eventData.title,
                    start: eventData.start,
                    end: eventData.end || null,
                    allDay: eventData.allDay,
                });
                setEvents(prev => prev.map(e => e.id === eventData.id ? updatedEvent : e));
            } else {
                // Create
                const newEvent = await api.post('/api/events', {
                    title: eventData.title,
                    start: eventData.start,
                    end: eventData.end || null,
                    allDay: eventData.allDay,
                });
                setEvents(prev => [...prev, newEvent]);
            }
            setIsModalOpen(false);
        } catch (err) {
            alert(err.message);
        }
    };

    // ── Delete event ──
    const handleDeleteEvent = async (eventId) => {
        try {
            await api.delete(`/api/events/${eventId}`);
            setEvents(prev => prev.filter(e => e.id !== eventId));
            setIsModalOpen(false);
        } catch (err) {
            alert(err.message);
        }
    };

    // ── Double click mapping ──
    const clickTimer = useRef(null);

    const handleEventClick = (info) => {
        if (clickTimer.current) {
            // Double click
            clearTimeout(clickTimer.current);
            clickTimer.current = null;

            // Open modal to edit
            setInitialEventData({
                id: info.event.id,
                title: info.event.title,
                startStr: info.event.startStr,
                endStr: info.event.endStr,
                allDay: info.event.allDay
            });
            setIsModalOpen(true);
        } else {
            // Single click waits 250ms
            clickTimer.current = setTimeout(() => {
                clickTimer.current = null;
            }, 250);
        }
    };

    const calendarLocale = lang === 'cs' ? csLocale : enLocale;

    return (
        <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl shadow-sm p-4 lg:p-6 border border-slate-100 dark:border-slate-700/50 relative max-h-min transition-colors duration-300">
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={calendarLocale}
                headerToolbar={{
                    left: 'prev,next',
                    center: 'title',
                    right: isMobile ? 'dayGridMonth' : 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                editable={false}
                selectable={true}
                height="65vh"
                dayMaxEvents={3}
                datesSet={(info) => {
                    fetchEvents(info);
                    setCurrentView(info.view.type);
                }}
                noEventsText={t('dashboard.noEvents') || 'No events'}
            />

            {/* Floating Action Button */}
            <button
                onClick={handleFABClick}
                className={`${(!isMobile || currentView === 'listDay') ? 'flex' : 'hidden'} lg:flex absolute bottom-6 right-6 lg:bottom-8 lg:right-8 group items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 z-10 overflow-hidden`}
            >
                <div className="flex items-center">
                    <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap font-medium pr-1">
                        {t('dashboard.newEvent')}
                    </span>
                </div>
            </button>

            <EventFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEvent}
                onDelete={handleDeleteEvent}
                initialData={initialEventData}
            />
        </div>
    );
}

export default CalendarView;
