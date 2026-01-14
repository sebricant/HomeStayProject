"use client";
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

export default function CalendarPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        fetch('/api/bookings/calendar')
            .then(r => r.json())
            .then(json => {
                if (json.success) setEvents(json.data);
            });
    }, []);

    // Simple Month Grid Logic
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = date.toLocaleString('default', { month: 'long' });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const changeMonth = (offset: number) => {
        setDate(new Date(year, month + offset, 1));
    };

    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary-dark">Booking Overview</h1>
                    <p className="text-text-muted text-sm">Manage occupancy and reservations</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-50 rounded-lg text-primary transition-colors"><Icon name="ChevronLeft" /></button>
                    <span className="font-heading font-bold w-40 text-center select-none text-lg text-primary-dark">{monthName} {year}</span>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-50 rounded-lg text-primary transition-colors"><Icon name="ChevronRight" /></button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                {/* Legend */}
                <div className="flex gap-6 mb-8 text-xs font-bold uppercase tracking-wider text-gray-500 justify-center">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary"></div> Confirmed</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-accent-gold"></div> Pending</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-200"></div> Cancelled</div>
                </div>

                <div className="grid grid-cols-7 gap-4 mb-4 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-xs font-bold text-gray-400 uppercase tracking-widest py-2">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-4">
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-36 bg-gray-50/30 rounded-xl" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isToday = new Date().toISOString().split('T')[0] === dateStr;

                        const dayEvents = events.filter(e => {
                            const s = new Date(e.start);
                            const end = new Date(e.end);
                            const d = new Date(dateStr);
                            return d >= new Date(s.setHours(0, 0, 0, 0)) && d <= new Date(end.setHours(0, 0, 0, 0));
                        });

                        return (
                            <div key={day} className={`h-36 border rounded-xl p-3 transition-all relative group
                                ${isToday ? 'border-primary/50 bg-primary/5 shadow-md' : 'border-gray-100 bg-white hover:border-primary/30 hover:shadow-lg hover:-translate-y-1'}
                            `}>
                                <span className={`font-bold text-lg ${isToday ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`}>{day}</span>

                                <div className="mt-2 space-y-1.5 overflow-y-auto max-h-[90px] pr-1 custom-scrollbar">
                                    {dayEvents.map(ev => {
                                        const isConfirmed = ev.status === 'Confirmed' || ev.status === 'Payment Received' || ev.status === 'Completed';
                                        const isCancelled = ev.status === 'Cancelled';

                                        return (
                                            <div key={ev.id}
                                                className={`text-[10px] px-2 py-1 rounded-md truncate font-bold shadow-sm cursor-pointer transition-transform hover:scale-105 relative group/event
                                                ${isConfirmed ? 'bg-primary text-white' :
                                                        isCancelled ? 'bg-gray-100 text-gray-400 line-through' :
                                                            'bg-accent-gold text-white'}`}
                                            >
                                                {ev.title}

                                                {/* Premium Tooltip */}
                                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max min-w-[180px] bg-white text-gray-800 p-3 rounded-xl shadow-xl opacity-0 group-hover/event:opacity-100 transition-all z-50 pointer-events-none border border-gray-100 transform translate-y-2 group-hover/event:translate-y-0">
                                                    <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-2">
                                                        <div className={`w-2 h-2 rounded-full ${isConfirmed ? 'bg-status-success' : 'bg-accent-gold'}`}></div>
                                                        <span className="font-heading font-bold text-sm text-primary-dark">{ev.title}</span>
                                                    </div>
                                                    <div className="space-y-1 text-xs text-gray-500">
                                                        <div className="flex justify-between">
                                                            <span>Room:</span> <span className="font-bold text-gray-700">{ev.room || 'Standard'}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Status:</span> <span className={`font-bold ${isConfirmed ? 'text-status-success' : 'text-accent-gold'}`}>{ev.status}</span>
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 mt-1 pt-1 border-t border-gray-50 text-right">
                                                            {new Date(ev.start).toLocaleDateString()} - {new Date(ev.end).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    {/* Triangle Arrow */}
                                                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white"></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
