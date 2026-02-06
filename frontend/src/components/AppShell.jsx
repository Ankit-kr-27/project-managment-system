import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getProjects } from "../api/project.api";
import {
    LayoutDashboard,
    CheckSquare,
    Users,
    Calendar,
    Settings,
    Search,
    ChevronRight,
    Plus,
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
    Building2,
    ChevronDown,
    Building
} from "lucide-react";
import { getUserOrganizations } from "../api/organization.api";
import CreateProjectModal from "./CreateProjectModal";

export default function AppShell({ children }) {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [projects, setProjects] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [organizations, setOrganizations] = useState([]);
    const [currentOrg, setCurrentOrg] = useState(null);
    const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const loadProjects = async () => {
        try {
            const res = await getProjects();
            const currentOrgId = localStorage.getItem("currentOrganizationId");
            let allProjects = res.data.data || [];
            if (currentOrgId) {
                allProjects = allProjects.filter(p => p.project?.organization === currentOrgId);
            }
            setProjects(allProjects);
        } catch (err) {
            console.error("Failed to load projects", err);
        }
    };

    const loadOrganizations = async () => {
        try {
            const orgsData = await getUserOrganizations();
            const orgsList = Array.isArray(orgsData.data) ? orgsData.data : [];
            setOrganizations(orgsList);

            const currentOrgId = localStorage.getItem("currentOrganizationId");
            if (currentOrgId) {
                const current = orgsList.find(o => o._id === currentOrgId);
                setCurrentOrg(current);
            }
        } catch (err) {
            console.error("Failed to load organizations", err);
        }
    };

    useEffect(() => {
        loadProjects();
        loadOrganizations();
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden">
            <CreateProjectModal
                isOpen={isCreateProjectOpen}
                onClose={() => setIsCreateProjectOpen(false)}
                onProjectCreated={loadProjects}
            />
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className={`relative bg-card border-r border-border flex flex-col z-40 overflow-hidden transition-colors duration-300`}
            >
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold shrink-0 text-white">T</div>
                        {isSidebarOpen && <span className="text-xl font-bold tracking-tight whitespace-nowrap">Taskora</span>}
                    </div>
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
                    <SidebarLink
                        icon={<Users size={20} />}
                        label="Teams"
                        collapsed={!isSidebarOpen}
                        active={isActive("/teams")}
                        onClick={() => navigate("/teams")}
                    />
                    <SidebarLink
                        icon={<Calendar size={20} />}
                        label="Calendar"
                        collapsed={!isSidebarOpen}
                        active={isActive("/calendar")}
                        onClick={() => navigate("/calendar")}
                    />

                    <div className="pt-8 pb-4">
                        {isSidebarOpen ? (
                            <span className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Projects</span>
                        ) : (
                            <div className="h-px bg-border mx-4" />
                        )}
                    </div>

                    {projects
                        .filter(item => item.project?.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((item) => (
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

                <div className="p-4 border-t border-border space-y-1">
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
                        className="text-red-500 hover:text-red-400"
                    />
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-background">
                <header className="h-20 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-8 z-30 transition-colors duration-300">
                    <div className="flex items-center gap-6 flex-1">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-accent rounded-xl transition-colors"
                        >
                            <Menu size={20} />
                        </button>

                        {/* Organization Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted border border-border hover:bg-accent transition-all group"
                            >
                                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Building2 size={14} />
                                </div>
                                <div className="text-left hidden md:block overflow-hidden max-w-[120px]">
                                    <div className="text-xs font-bold truncate tracking-tight">{currentOrg?.name || "Select Org"}</div>
                                </div>
                                <ChevronDown size={14} className={`text-muted-foreground group-hover:text-foreground transition-transform ${isOrgDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isOrgDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden py-2"
                                    >
                                        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/50 mb-1">
                                            Switch Organization
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                            {organizations.map((org) => (
                                                <button
                                                    key={org._id}
                                                    onClick={() => {
                                                        localStorage.setItem("currentOrganizationId", org._id);
                                                        window.location.reload(); // Reload to refresh all data context
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left ${currentOrg?._id === org._id ? 'bg-primary/5 text-primary' : ''}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${currentOrg?._id === org._id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                                                        {org.name[0]}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-bold truncate">{org.name}</div>
                                                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none mt-1">{org.members?.length || 1} Members</div>
                                                    </div>
                                                    {currentOrg?._id === org._id && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => navigate("/create-organization")}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left border-t border-border mt-1"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                                <Plus size={16} />
                                            </div>
                                            <div className="text-sm font-bold">New Organization</div>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="max-w-md w-full relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                className="w-full bg-muted border border-border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-card border border-border hover:bg-accent transition-all text-muted-foreground hover:text-foreground"
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <div className="flex items-center gap-3 pl-4 border-l border-border ml-2">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold truncate max-w-[150px]">{user?.fullName || user?.username || "Guest"}</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{user?.email || "Member"}</div>
                            </div>
                            <div
                                className="w-10 h-10 rounded-full border border-border shadow-lg shrink-0 cursor-pointer hover:border-primary transition-all hover:scale-105 overflow-hidden bg-muted"
                                onClick={() => navigate("/settings")}
                            >
                                <img
                                    src={user?.avatar?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Guest'}`}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Guest'}`;
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto custom-scrollbar">
                    {React.Children.map(children, child => {
                        if (React.isValidElement(child)) {
                            return React.cloneElement(child, { searchQuery });
                        }
                        return child;
                    })}
                </main>
            </div >
        </div >
    );
}

function SidebarLink({ icon, label, active = false, collapsed = false, className = "", onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${active
                ? 'bg-primary/10 text-primary font-bold shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                } ${className}`}
            title={collapsed ? label : ""}
        >
            <div className={`shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-primary' : ''}`}>{icon}</div>
            {!collapsed && <span className="text-sm truncate font-medium">{label}</span>}
            {!collapsed && active && <motion.div layoutId="sidebar-active" className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />}
        </button>
    );
}
