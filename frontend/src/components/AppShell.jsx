import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getProjects } from "../api/project.api";
import {
    LayoutDashboard,
    CheckSquare,
    Users,
    Calendar,
    Settings,
    Search,
    Bell,
    ChevronRight,
    Plus,
    LogOut,
    Menu,
    X
} from "lucide-react";
import CreateProjectModal from "./CreateProjectModal";

export default function AppShell({ children }) {
    const { user, logout } = useAuth();
    const [projects, setProjects] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const loadProjects = async () => {
        try {
            const res = await getProjects();
            setProjects(res.data.data || []);
        } catch (err) {
            console.error("Failed to load projects", err);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex min-h-screen bg-[#09090b] text-white overflow-hidden">
            <CreateProjectModal
                isOpen={isCreateProjectOpen}
                onClose={() => setIsCreateProjectOpen(false)}
                onProjectCreated={loadProjects}
            />
            {/* Sidebar */}
            <aside className={`glass border-r border-white/5 w-64 flex flex-col transition-all duration-300 z-40 fixed lg:relative h-full ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'}`}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold shrink-0">T</div>
                        {isSidebarOpen && <span className="text-xl font-bold tracking-tight whitespace-nowrap">Taskora</span>}
                    </div>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                    <SidebarLink
                        icon={<LayoutDashboard size={20} />}
                        label="Overview"
                        active={isActive("/dashboard")}
                        collapsed={!isSidebarOpen}
                        onClick={() => navigate("/dashboard")}
                    />
                    <SidebarLink
                        icon={<CheckSquare size={20} />}
                        label="Analytics"
                        active={isActive("/analytics")}
                        collapsed={!isSidebarOpen}
                        onClick={() => navigate("/analytics")}
                    />
                    <SidebarLink icon={<Users size={20} />} label="Teams" collapsed={!isSidebarOpen} />
                    <SidebarLink icon={<Calendar size={20} />} label="Calendar" collapsed={!isSidebarOpen} />

                    <div className="pt-8 pb-4">
                        {isSidebarOpen ? (
                            <span className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Projects</span>
                        ) : (
                            <div className="h-px bg-white/5 mx-4" />
                        )}
                    </div>

                    {projects.map((item) => (
                        <SidebarLink
                            key={item.project?._id}
                            icon={<div className="w-2 h-2 rounded-full bg-primary" />}
                            label={item.project?.name}
                            collapsed={!isSidebarOpen}
                            active={location.pathname === `/project/${item.project?._id}`}
                            onClick={() => navigate(`/project/${item.project?._id}`)}
                        />
                    ))}
                    <SidebarLink
                        icon={<Plus size={20} />}
                        label="Add Project"
                        collapsed={!isSidebarOpen}
                        className="text-primary hover:text-primary/80"
                        onClick={() => setIsCreateProjectOpen(true)}
                    />
                </nav>

                <div className="p-4 border-t border-white/5 space-y-1">
                    <SidebarLink
                        icon={<Settings size={20} />}
                        label="Settings"
                        active={isActive("/settings")}
                        collapsed={!isSidebarOpen}
                        onClick={() => navigate("/settings")}
                    />
                    <SidebarLink
                        icon={<LogOut size={20} />}
                        label="Logout"
                        collapsed={!isSidebarOpen}
                        onClick={logout}
                        className="text-red-400 hover:text-red-300"
                    />
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-[#09090b]/80 backdrop-blur-md z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="relative w-64 md:w-96 hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-muted-foreground hover:text-foreground">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-[#09090b]"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold truncate max-w-[150px]">{user?.fullName || user?.username || "Guest"}</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{user?.email || "Member"}</div>
                            </div>
                            <div
                                className="w-10 h-10 rounded-full bg-cover bg-center border border-white/10 shadow-lg shrink-0 cursor-pointer hover:border-primary/50 transition-colors"
                                onClick={() => navigate("/settings")}
                                style={{
                                    backgroundImage: `url(${user?.avatar?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Guest'}`})`,
                                    backgroundColor: '#18181b'
                                }}
                            />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}

function SidebarLink({ icon, label, active = false, collapsed = false, className = "", onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${active ? 'bg-primary/20 text-white font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'} ${className}`}
            title={collapsed ? label : ""}
        >
            <div className="shrink-0">{icon}</div>
            {!collapsed && <span className="text-sm truncate">{label}</span>}
            {!collapsed && active && <div className="ml-auto w-1 h-4 bg-primary rounded-full" />}
        </button>
    );
}
