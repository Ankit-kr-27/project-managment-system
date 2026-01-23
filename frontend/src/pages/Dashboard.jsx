import { useEffect, useState } from "react";
import { getProjects, createProject } from "../api/project.api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "../components/AppShell";
import {
  CheckSquare,
  TrendingUp,
  Clock,
  Briefcase,
  AlertCircle,
  Plus,
  Calendar,
  Layers,
  CheckCircle,
  Activity,
  ArrowRight
} from "lucide-react";
import { getMyTasks } from "../api/task.api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const CHART_DATA = [
  { name: 'Phase 1', progress: 10 },
  { name: 'Phase 2', progress: 45 },
  { name: 'Phase 3', progress: 30 },
  { name: 'Launch', progress: 74 },
];

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectDeadline, setProjectDeadline] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        getProjects(),
        getMyTasks()
      ]);
      setProjects(projRes.data.data || []);
      setMyTasks(tasksRes.data.data || []);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await createProject({
        name: projectName,
        description: projectDesc,
        startDate: projectStartDate,
        deadline: projectDeadline
      });
      setShowProjectForm(false);
      setProjectName("");
      setProjectDesc("");
      setProjectStartDate("");
      setProjectDeadline("");
      loadData();
      navigate(`/project/${res.data.data._id}`);
    } catch (err) {
      console.error("Failed to create project", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    total: myTasks.length,
    completed: myTasks.filter(t => t.status === 'DONE').length,
    inProgress: myTasks.filter(t => t.status === 'IN_PROGRESS').length,
    todo: myTasks.filter(t => t.status === 'TODO').length,
  };

  return (
    <AppShell>
      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="My Tasks" value={stats.total} trend="Total" icon={<Briefcase className="text-primary" />} />
          <StatCard label="Completed" value={stats.completed} trend="Done" icon={<CheckSquare className="text-green-500" />} />
          <StatCard label="In Progress" value={stats.inProgress} trend="Active" icon={<Clock className="text-yellow-500" />} />
          <StatCard label="To Do" value={stats.todo} trend="Upcoming" icon={<AlertCircle className="text-red-500" />} />
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Overview Chart */}
          <div className="lg:col-span-2 glass rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">My Recent Tasks</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">Assigned to you:</span>
                  <span className="text-xs text-primary font-bold uppercase tracking-wider">{myTasks.length} Tasks</span>
                </div>
              </div>
              <button
                onClick={() => setShowProjectForm(true)}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
              >
                <Plus size={16} /> Create Project
              </button>
            </div>

            <div className="space-y-4 pt-4">
              {myTasks.slice(0, 4).map((task) => (
                <div key={task._id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer" onClick={() => navigate(`/project/${task.project?._id}`)}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${task.status === 'DONE' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
                      {task.status === 'DONE' ? <CheckCircle size={20} /> : <Activity size={20} />}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{task.title}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{task.project?.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md bg-white/5 border border-white/5">
                      {task.status.replace('_', ' ')}
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground" />
                  </div>
                </div>
              ))}
              {myTasks.length === 0 && (
                <div className="h-40 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center text-muted-foreground/30 text-xs uppercase font-bold tracking-widest">
                  No tasks assigned to you
                </div>
              )}
            </div>
          </div>

          {/* Schedule Sidebar Column */}
          <div className="space-y-8">
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold">Schedule</h3>
                <button className="text-muted-foreground hover:text-foreground">
                  <Calendar size={18} />
                </button>
              </div>
              <div className="space-y-6">
                <ScheduleItem time="10:00 AM" label="Sprint Planning" color="bg-green-500" />
                <ScheduleItem time="02:00 PM" label="Stakeholder Sync" color="bg-yellow-500" />
                <ScheduleItem time="04:30 PM" label="Design Review" color="bg-primary" />
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <h3 className="font-bold mb-6">Team Health</h3>
              <div className="space-y-4">
                <HealthBar label="Workload" status="Healthy" percent={85} color="bg-green-500" />
                <HealthBar label="Velocity" status="Warning" percent={45} color="bg-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showProjectForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-lg glass bg-[#0c0c0e] rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-bold">New Project Initiation</h3>
                <button onClick={() => setShowProjectForm(false)} className="text-muted-foreground hover:text-white">&times;</button>
              </div>
              <form onSubmit={handleCreateProject} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Project Name</label>
                  <input
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-primary focus:outline-none"
                    placeholder="e.g., Quantum System Migration"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Description</label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-primary focus:outline-none min-h-[100px]"
                    placeholder="Brief overview of objectives..."
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Start Date</label>
                    <input
                      type="date"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-primary focus:outline-none"
                      value={projectStartDate}
                      onChange={(e) => setProjectStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Deadline</label>
                    <input
                      type="date"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-primary focus:outline-none"
                      value={projectDeadline}
                      onChange={(e) => setProjectDeadline(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Initializing..." : "Create Project"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppShell>

  );
}

function StatCard({ label, value, trend, icon }) {

  return (
    <div className="glass rounded-2xl p-6 flex items-start justify-between relative overflow-hidden group hover:bg-white/[0.07] transition-all">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg glass flex items-center justify-center">
            {icon}
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
        </div>
        <div>
          <span className="text-3xl font-bold">{value}</span>
        </div>
      </div>
      <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : trend.startsWith('-') ? 'bg-red-500/10 text-red-500' : 'bg-white/10 text-muted-foreground'}`}>
        {trend}
      </div>
      <div className="absolute -bottom-6 -right-6 text-white/5 scale-150 rotate-12 group-hover:scale-[1.7] transition-transform duration-500">
        {icon}
      </div>
    </div>
  );
}

function ScheduleItem({ time, label, color }) {
  return (
    <div className="flex items-center gap-4 group cursor-pointer">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <div>
        <div className="text-sm font-bold group-hover:text-primary transition-colors">{label}</div>
        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{time}</div>
      </div>
    </div>
  );
}

function HealthBar({ label, status, percent, color }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
        <span>{label}</span>
        <span className={status === 'Healthy' ? 'text-green-500' : 'text-yellow-500'}>{status}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}
