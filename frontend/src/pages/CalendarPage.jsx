import AppShell from "../components/AppShell";
import CalendarView from "../components/CalendarView";

export default function CalendarPage() {
    return (
        <AppShell>
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Global Calendar</h1>
                    <p className="text-muted-foreground text-sm">View all your tasks across all projects in one place.</p>
                </div>
                <div className="glass p-8 rounded-[32px] border border-border">
                    <CalendarView />
                </div>
            </div>
        </AppShell>
    );
}
