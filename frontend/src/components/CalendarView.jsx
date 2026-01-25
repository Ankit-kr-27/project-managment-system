import { useEffect, useState } from "react";
import { getCalendarTasks } from "../api/calendar.api";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CalendarView({ projectId }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const start = startOfMonth(currentDate);
                const end = endOfMonth(currentDate);
                const res = await getCalendarTasks(projectId, start.toISOString(), end.toISOString());
                setTasks(res.data || []);
            } catch (err) {
                console.error("Failed to load calendar tasks", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, [projectId, currentDate]);

    const days = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });

    const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{format(currentDate, "MMMM yyyy")}</h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-full"><ChevronLeft /></button>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-full"><ChevronRight /></button>
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-7 gap-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <div key={day} className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground py-2">
                            {day}
                        </div>
                    ))}
                    {days.map((day) => {
                        const dayTasks = tasks.filter(t => isSameDay(new Date(t.deadline), day));
                        return (
                            <div
                                key={day.toString()}
                                className={`min-h-[120px] glass rounded-xl p-3 border border-white/5 flex flex-col gap-2 ${isToday(day) ? 'ring-1 ring-primary' : ''}`}
                            >
                                <span className={`text-sm font-bold ${isToday(day) ? 'text-primary' : 'text-muted-foreground'}`}>
                                    {format(day, "d")}
                                </span>
                                <div className="space-y-1">
                                    {dayTasks.map(task => (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            key={task._id}
                                            className={`text-[10px] p-1.5 rounded-lg truncate font-bold cursor-pointer hover:opacity-80
                                        ${task.priority === 'high' ? 'bg-red-500/20 text-red-500' :
                                                    task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                                                        'bg-blue-500/20 text-blue-500'}`}
                                            title={task.title}
                                        >
                                            {task.title}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
