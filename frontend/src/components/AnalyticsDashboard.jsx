import { getProjectAnalytics } from "../api/analytics.api";
import { Loader2, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnalyticsDashboard({ projectId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            setLoading(true);
            try {
                const res = await getProjectAnalytics(projectId);
                setData(res.data || {});
            } catch (err) {
                console.error("Failed to load analytics", err);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, [projectId]);

    if (loading) {
        return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
    }

    if (!data) return <div>No data available</div>;

    const statusData = Object.keys(data.statusDistribution || {}).map((key, index) => ({
        name: key.replace("_", " "),
        value: data.statusDistribution[key],
        color: COLORS[index % COLORS.length]
    }));

    const priorityData = Object.keys(data.priorityDistribution || {}).map((key) => ({
        name: key,
        value: data.priorityDistribution[key]
    }));

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="High Priority Tasks"
                    value={data.priorityDistribution?.high || 0}
                    icon={<AlertCircle className="text-red-500" />}
                />
                <StatCard
                    label="Completed Tasks"
                    value={data.statusDistribution?.done || 0}
                    icon={<CheckCircle className="text-green-500" />}
                />
                <StatCard
                    label="Total Workload"
                    value={Object.values(data.statusDistribution || {}).reduce((a, b) => a + b, 0)}
                    icon={<TrendingUp className="text-blue-500" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-3xl border border-white/5">
                    <h3 className="text-xl font-bold mb-6">Task Status</h3>
                    <div className="h-[300px]">
                        {statusData.length > 0 && statusData.some(d => d.value > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', border: 'none' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground text-xs uppercase font-bold tracking-widest">
                                No Enough Data
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center gap-4 mt-4 flex-wrap">
                        {statusData.map((entry) => (
                            <div key={entry.name} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass p-8 rounded-3xl border border-white/5">
                    <h3 className="text-xl font-bold mb-6">Priority Breakdown</h3>
                    <div className="h-[300px]">
                        {priorityData.length > 0 && priorityData.some(d => d.value > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={priorityData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                    <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', border: 'none' }} />
                                    <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                                        {priorityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.name === 'high' ? '#ef4444' : entry.name === 'medium' ? '#eab308' : '#3b82f6'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground text-xs uppercase font-bold tracking-widest">
                                No Enough Data
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon }) {
    return (
        <div className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between">
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
                <p className="text-3xl font-bold">{value}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
                {icon}
            </div>
        </div>
    )
}
