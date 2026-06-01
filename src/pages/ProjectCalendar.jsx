import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User, Hash, AlertCircle } from 'lucide-react';

const WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const MONTHS = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export default function ProjectCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // Default to June 2026 matching system time
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [user, setUser] = useState(null);
    const [syncing, setSyncing] = useState(false);

    // Fetch user session on load to determine if admin
    useEffect(() => {
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setUser(data);
                }
            })
            .catch(err => console.error('Failed to fetch session:', err));
    }, []);

    const fetchEvents = () => {
        setLoading(true);
        fetch('/api/calendar')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setEvents(data);
                }
            })
            .catch(err => console.error('Failed to fetch calendar events:', err))
            .finally(() => setLoading(false));
    };

    // Fetch calendar events
    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSyncCalendar = async () => {
        if (!confirm('Bütün projelerin tarih aralıklarını yeniden hesaplayıp takvimi senkronize etmek istediğinize emin misiniz? (Mevcut takvim temizlenip projelerden baştan oluşturulacaktır)')) {
            return;
        }

        try {
            setSyncing(true);
            const res = await fetch('/api/calendar', {
                method: 'POST'
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message || 'Senkronizasyon başarıyla tamamlandı!');
                fetchEvents(); // Reload calendar grid
            } else {
                throw new Error(data.error || 'Senkronizasyon başarısız oldu.');
            }
        } catch (error) {
            console.error('Sync error:', error);
            alert(error.message || 'Senkronizasyon işlemi sırasında hata oluştu.');
        } finally {
            setSyncing(false);
        }
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Helper: Navigation handlers
    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleMonthChange = (e) => {
        setCurrentDate(new Date(year, parseInt(e.target.value), 1));
    };

    const handleYearChange = (e) => {
        setCurrentDate(new Date(parseInt(e.target.value), month, 1));
    };

    // Calculate calendar days
    // Grid starts at the nearest Monday of the 1st day of the selected month
    const firstDayOfMonth = new Date(year, month, 1);
    // getDay() is 0 for Sun, 1 for Mon... We want 0 for Mon, 6 for Sun
    let startOffset = firstDayOfMonth.getDay() - 1;
    if (startOffset === -1) startOffset = 6; // Sunday

    const gridStartDate = new Date(year, month, 1 - startOffset);

    // Total 42 days grid (6 weeks)
    const calendarDays = [];
    for (let i = 0; i < 42; i++) {
        const day = new Date(gridStartDate);
        day.setDate(gridStartDate.getDate() + i);
        calendarDays.push(day);
    }

    // --- ALGORITHM: Multi-day Spanning with Row Slot Assignment ---
    // 1. Sort events: longer durations first, then earlier start dates
    const sortedEvents = [...events].sort((a, b) => {
        const durationA = new Date(a.endDate) - new Date(a.startDate);
        const durationB = new Date(b.endDate) - new Date(b.startDate);
        if (durationB !== durationA) return durationB - durationA;
        return new Date(a.startDate) - new Date(b.startDate);
    });

    const eventSlots = {}; // eventId -> slot number
    const daySlots = Array(calendarDays.length).fill(null).map(() => []);

    sortedEvents.forEach(event => {
        // Parse dates in local timezone to avoid off-by-one errors
        const eventStart = new Date(event.startDate + 'T00:00:00');
        const eventEnd = new Date(event.endDate + 'T23:59:59');

        // Find active days for this event in current grid
        const activeIndices = [];
        calendarDays.forEach((day, idx) => {
            const checkDay = new Date(day);
            checkDay.setHours(12, 0, 0, 0); // avoid time issues
            if (checkDay >= eventStart && checkDay <= eventEnd) {
                activeIndices.push(idx);
            }
        });

        if (activeIndices.length === 0) return; // Event not in current view

        // Find first free slot on all active indices
        let slot = 0;
        while (true) {
            const isSlotFree = activeIndices.every(idx => !daySlots[idx][slot]);
            if (isSlotFree) break;
            slot++;
        }

        // Assign the slot
        eventSlots[event.id] = slot;
        activeIndices.forEach(idx => {
            daySlots[idx][slot] = event;
        });
    });

    // Helper: Determine max slot count to size cells properly
    const getMaxSlotCount = () => {
        let max = 0;
        daySlots.forEach(slots => {
            max = Math.max(max, slots.length);
        });
        return Math.max(max, 3); // Minimum 3 slots height
    };

    const maxSlots = getMaxSlotCount();

    return (
        <div className="space-y-6">
            {/* Header / Nav */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="text-blue-500" size={24} />
                        Proje Zaman Çizelgesi
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Projelerin takvimsel dağılımı ve aktiflik süreleri</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-600 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex gap-2">
                        <select
                            value={month}
                            onChange={handleMonthChange}
                            className="bg-white px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            {MONTHS.map((m, idx) => (
                                <option key={m} value={idx}>{m}</option>
                            ))}
                        </select>

                        <select
                            value={year}
                            onChange={handleYearChange}
                            className="bg-white px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            {Array.from({ length: 10 }, (_, i) => year - 5 + i).map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-600 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Event Info Popup (Displays on Click with backdrop blur overlay) */}
            {selectedEvent && (
                <div 
                    onClick={() => setSelectedEvent(null)}
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()} 
                        className="bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150 relative overflow-hidden"
                    >
                        {/* Top Accent Strip */}
                        <div 
                            style={{ backgroundColor: selectedEvent.color }} 
                            className="absolute top-0 left-0 right-0 h-2" 
                        />
                        
                        <div className="flex justify-between items-start pt-2">
                            <div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 font-mono">
                                    <Hash size={12} className="text-slate-400" />
                                    {selectedEvent.code}
                                </span>
                            </div>
                            <button 
                                onClick={() => setSelectedEvent(null)}
                                className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-50 transition-colors"
                            >
                                <ChevronRight size={18} className="rotate-90" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-slate-900 leading-snug">
                                {selectedEvent.title}
                            </h3>
                            
                            <hr className="border-slate-100" />

                            <div className="grid grid-cols-1 gap-3 py-1">
                                <div className="flex items-center gap-2.5 text-sm text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                    <User size={16} className="text-blue-500 shrink-0" />
                                    <div>
                                        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Proje Yürütücüsü (PI)</div>
                                        <div className="font-semibold text-slate-800">{selectedEvent.pi}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2.5 text-sm text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                    <Calendar size={16} className="text-emerald-500 shrink-0" />
                                    <div>
                                        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Çalışma Tarihleri</div>
                                        <div className="font-semibold text-slate-800">{selectedEvent.startDate} — {selectedEvent.endDate}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Calendar Main Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-slate-200">
                    <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                    <p className="mt-4 text-slate-500 font-medium">Takvim yükleniyor...</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Weekdays Row */}
                    <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center py-3 font-semibold text-xs text-slate-600 uppercase tracking-wider">
                        {WEEKDAYS.map(day => (
                            <div key={day}>{day}</div>
                        ))}
                    </div>

                    {/* Monthly Calendar Grid (6 rows of 7 days) */}
                    <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 border-t border-slate-100 bg-slate-50/20">
                        {calendarDays.map((day, idx) => {
                            const isCurrentMonth = day.getMonth() === month;
                            const isToday = new Date().toDateString() === day.toDateString();
                            const dayEvents = daySlots[idx] || [];

                            return (
                                <div
                                    key={idx}
                                    className={`min-h-[140px] p-2 bg-white flex flex-col justify-between transition-all ${
                                        isCurrentMonth ? '' : 'bg-slate-50/50 text-slate-400'
                                    }`}
                                >
                                    {/* Date Header */}
                                    <div className="flex justify-between items-center mb-2">
                                        <span
                                            className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                                                isToday
                                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                                    : isCurrentMonth
                                                    ? 'text-slate-700'
                                                    : 'text-slate-400'
                                            }`}
                                        >
                                            {day.getDate()}
                                        </span>
                                    </div>

                                    {/* Event Slots */}
                                    <div className="flex-1 space-y-1.5">
                                        {Array.from({ length: maxSlots }).map((_, slotIdx) => {
                                            const event = dayEvents[slotIdx];

                                            if (event) {
                                                const eventStart = new Date(event.startDate + 'T00:00:00');
                                                const eventEnd = new Date(event.endDate + 'T23:59:59');

                                                // Borders: Rounded left only if start of project, rounded right only if end of project
                                                const isProjectStart = day.toDateString() === eventStart.toDateString();
                                                const isProjectEnd = day.toDateString() === eventEnd.toDateString();
                                                
                                                // Display name on Monday (idx % 7 === 0) or on project start date
                                                const showName = isProjectStart || day.getDay() === 1;

                                                const isSelected = selectedEvent?.id === event.id;

                                                return (
                                                    <div
                                                        key={slotIdx}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedEvent(event);
                                                        }}
                                                        style={{ backgroundColor: event.color }}
                                                        className={`h-7 flex items-center text-[11px] font-bold text-white px-2 cursor-pointer transition-all shadow-sm hover:scale-[1.02] hover:brightness-110 hover:shadow-md hover:z-10 ${
                                                            isProjectStart ? 'rounded-l-lg ml-1' : 'border-l-0'
                                                        } ${
                                                            isProjectEnd ? 'rounded-r-lg mr-1' : 'border-r-0'
                                                        } ${
                                                            isSelected ? 'ring-2 ring-white ring-offset-2 scale-[1.02] shadow-md z-10' : ''
                                                        }`}
                                                    >
                                                        {showName && (
                                                            <span className="truncate w-full drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
                                                                {event.title}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            }

                                            // Render empty spacer to keep slots aligned horizontally across columns
                                            return <div key={slotIdx} className="h-7" />;
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Admin Migration Sync Bar */}
            {user?.role === 'admin' && (
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center justify-between gap-4 mt-6">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <AlertCircle size={16} className="text-amber-500 shrink-0" />
                        <span>Sistem Yöneticisi: Takvimi veritabanındaki mevcut projelerin tüm tarih verileriyle yeniden eşitleyebilirsiniz.</span>
                    </div>
                    <button
                        onClick={handleSyncCalendar}
                        disabled={syncing}
                        className={`px-4 py-2 bg-slate-950 text-white font-semibold rounded-lg text-xs hover:bg-slate-800 transition-all shadow-sm shrink-0 flex items-center gap-1.5 ${
                            syncing ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {syncing ? (
                            <>
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                                Eşitleniyor...
                            </>
                        ) : (
                            'Takvimi Senkronize Et (Full Sync)'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
