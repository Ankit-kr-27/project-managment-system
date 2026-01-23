import { motion } from "framer-motion";
import AppShell from "../components/AppShell";
import {
    BarChart,

    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area
} from 'recharts';
import {
    TrendingUp,
    Zap,
    DollarSign,
    Activity,
    Calendar,
    Users,
    Download,
    MoreVertical,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

const BURN_DOWN_DATA = [
    { name: 'Week 1', actual: 100, target: 100 },
    { name: 'Week 2', actual: 85, target: 87 },
    { name: 'Week 3', actual: 70, target: 75 },
    { name: 'Week 4', actual: 60, target: 63 },
    { name: 'Week 5', actual: 45, target: 50 },
    { name: 'Week 6', actual: 30, target: 37 },
    { name: 'Week 7', actual: 20, target: 25 },
    { name: 'Week 8', actual: 10, target: 12 },
];

const PHASE_DATA = [
    { name: 'Development', value: 45, color: '#8b5cf6' },
    { name: 'Design & UX', value: 30, color: '#f59e0b' },
    { name: 'Quality Assurance', value: 25, color: '#10b981' },
];

export default function Analytics() {
    return (
        <AppShell>
            <div className="p-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">Performance Suite</div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">Project Analytics</h1>
                        <p className="text-muted-foreground">Real-time deep dive into project health, resource velocity, and cross-team allocation metrics.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex glass p-1 rounded-xl">
                            <button className="px-3 py-1.5 text-xs font-bold rounded-lg hover:bg-white/5">W</button>
                            <button className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded-lg">M</button>
                            <button className="px-3 py-1.5 text-xs font-bold rounded-lg hover:bg-white/5">Q</button>
                            <button className="px-3 py-1.5 text-xs font-bold rounded-lg hover:bg-white/5">Y</button>
                        </div>
                        <button className="px-4 py-2 glass rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
                            <Download size={16} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard label="Active Projects" value="34" change="+12%" icon={<TrendingUp className="text-primary" />} />
                    <MetricCard label="Efficiency Score" value="94.8%" change="+4.2%" icon={<Zap className="text-yellow-500" />} />
                    <MetricCard label="Budget Variance" value="+$12.4k" change="-2.1%" icon={<DollarSign className="text-green-500" />} />
                    <MetricCard label="Resource Velocity" value="4.8x" change="+0.8%" icon={<Activity className="text-primary" />} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Burn-down Chart */}
                    <div className="lg:col-span-2 glass rounded-3xl p-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-1">Burn-down Chart</h3>
                                <p className="text-sm text-muted-foreground">Tracking project velocity against roadmap targets.</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold">85.4%</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-green-500">Ahead of target</div>
                            </div>
                        </div>
                        <div className="h-80 w-full pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={BURN_DOWN_DATA}>
                                    <defs>
                                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="actual" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                                    <Line type="monotone" dataKey="target" stroke="rgba(255,255,255,0.2)" strokeDasharray="5 5" dot={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Phase Distribution */}
                    <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center space-y-8">
                        <h3 className="text-xl font-bold w-full">Phase Distribution</h3>
                        <div className="relative h-64 w-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={PHASE_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {PHASE_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="text-3xl font-bold">24</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Projects</div>
                            </div>
                        </div>
                        <div className="w-full space-y-4">
                            {PHASE_DATA.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-muted-foreground">{item.name}</span>
                                    </div>
                                    <span className="font-bold">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Resource Allocation Matrix Mockup */}
                <div className="glass rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold">Resource Allocation Matrix</h3>
                        <div className="flex gap-4">
                            <Legend color="bg-primary" label="Core Eng" />
                            <Legend color="bg-purple-900" label="Platform" />
                            <Legend color="bg-white/10" label="Idle/Buffer" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="space-y-3">
                                <div className="h-32 w-full bg-white/5 rounded-xl overflow-hidden flex flex-col justify-end p-2 gap-1">
                                    <div className="bg-primary/40 h-[60%] w-full rounded-lg" />
                                    <div className="bg-purple-900/40 h-[20%] w-full rounded-lg" />
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sprint {i + 1}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}


function MetricCard({ label, value, change, icon }) {

    const isPositive = change.startsWith('+');
    return (
        <div className="glass rounded-2xl p-6 relative overflow-hidden group hover:bg-white/[0.07] transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {change}
                </div>
            </div>
            <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
                <div className="text-3xl font-bold">{value}</div>
            </div>
            <div className="absolute -bottom-6 -right-6 text-white/5 scale-150 rotate-12 group-hover:scale-[1.7] transition-transform duration-500">
                {icon}
            </div>
        </div>
    );
}

function Legend({ color, label }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
        </div>
    );
}
