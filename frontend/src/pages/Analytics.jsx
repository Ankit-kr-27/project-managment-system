import AppShell from "../components/AppShell";
import { TrendingUp, BarChart2, PieChart } from "lucide-react";

export default function Analytics() {
    return (
        <AppShell>
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8 space-y-6">
                <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-4">
                    <TrendingUp size={48} className="text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Global Analytics</h1>
                <p className="text-muted-foreground max-w-md text-lg">
                    View aggregated insights across all your projects in the current organization.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mt-8">
                    <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                        <BarChart2 className="w-8 h-8 text-primary" />
                        <h3 className="text-xl font-bold">Project Performance</h3>
                        <p className="text-sm text-muted-foreground">Compare velocity and completion rates across active projects.</p>
                        <div className="text-xs font-bold uppercase tracking-widest text-primary pt-2">Coming Soon</div>
                    </div>
                    <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                        <PieChart className="w-8 h-8 text-purple-500" />
                        <h3 className="text-xl font-bold">Resource Allocation</h3>
                        <p className="text-sm text-muted-foreground">See how your team members are distributed across tasks.</p>
                        <div className="text-xs font-bold uppercase tracking-widest text-purple-500 pt-2">Coming Soon</div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
