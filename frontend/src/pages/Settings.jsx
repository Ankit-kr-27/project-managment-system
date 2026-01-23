import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    User,
    Shield,
    Bell,
    CreditCard,
    Camera,
    Mail,
    Briefcase,
    AlertCircle,
    ChevronRight,
    ExternalLink,
    Trash2,
    Lock,
    Moon,
    Loader2
} from "lucide-react";
import { updateAccount, deleteAccount } from "../api/auth.api";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";


export default function Settings() {

    const { user, setUser, logout } = useAuth();

    const [fullName, setFullName] = useState(user?.fullName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar?.url || "");
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || "");
            setEmail(user.email || "");
            setAvatarUrl(user.avatar?.url || "");
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const res = await updateAccount({ fullName, email, avatarUrl });
            setUser(res.data.data);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Update error", err);
            alert("Failed to update profile");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you absolutely sure? This action cannot be undone and you will lose all project data.")) {
            try {
                await deleteAccount();
                alert("Account deleted successfully.");
                logout();
            } catch (err) {
                console.error("Delete error", err);
                alert("Failed to delete account");
            }
        }
    };

    const handleAvatarChange = () => {
        const newSeed = Math.random().toString(36).substring(7);
        setAvatarUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`);
    };

    return (
        <AppShell>
            <div className="p-8 space-y-12 max-w-5xl mx-auto">

                {/* Header */}
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Workspace Settings</h1>
                    <p className="text-muted-foreground">Manage your personal profile, notification preferences, and security settings.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-1 space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 px-4">User Settings</div>
                        <NavButton icon={<User size={18} />} label="Profile Info" active />
                        <NavButton icon={<Shield size={18} />} label="Security" />
                        <NavButton icon={<Bell size={18} />} label="Notifications" />
                        <NavButton icon={<CreditCard size={18} />} label="Billing" />

                        <div className="pt-8 pb-4">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 px-4">Preference</div>
                        </div>
                        <div className="flex items-center justify-between px-4 py-2 text-sm text-muted-foreground bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Moon size={18} />
                                <span>Dark Mode</span>
                            </div>
                            <div className="w-8 h-4 bg-primary rounded-full relative">
                                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Profile Card */}
                        <div className="glass rounded-3xl p-8 relative overflow-hidden group">
                            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/5 shadow-2xl bg-[#18181b]">
                                        <img src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-[#09090b] rounded-full" />
                                </div>
                                <div className="text-center md:text-left space-y-2">
                                    <div className="flex flex-col md:flex-row items-center gap-3">
                                        <h2 className="text-2xl font-bold">{user?.username || "Guest User"}</h2>
                                        <div className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded flex items-center gap-1 uppercase tracking-tighter">
                                            <Shield size={10} /> Verified
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground flex items-center gap-2 justify-center md:justify-start text-sm">
                                        {user?.email} <span className="text-white/10">•</span> <span className="text-primary font-medium">Pro Member</span>
                                    </p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pt-1">
                                        Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Loading...'}
                                    </p>
                                </div>
                                <div className="md:ml-auto flex flex-col gap-3">
                                    <button
                                        onClick={handleAvatarChange}
                                        className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                    >
                                        Randomize Avatar
                                    </button>
                                    <button
                                        onClick={() => setAvatarUrl("")}
                                        className="px-6 py-2.5 glass text-xs font-bold rounded-xl hover:bg-white/10 transition-all"
                                    >
                                        Reset Photo
                                    </button>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -z-0 rounded-full group-hover:bg-primary/10 transition-colors" />
                        </div>

                        {/* General Details Form */}
                        <form onSubmit={handleUpdateProfile} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="glass rounded-3xl p-8 space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-primary">
                                            <User size={18} />
                                        </div>
                                        <h3 className="font-bold">General Details</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Full Name</label>
                                            <input
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Email Address</label>
                                            <input
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your work email"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Avatar URL</label>
                                            <input
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                                                value={avatarUrl}
                                                onChange={(e) => setAvatarUrl(e.target.value)}
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="glass rounded-3xl p-8 space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-lg glass flex items-center justify-center text-yellow-500">
                                            <Bell size={18} />
                                        </div>
                                        <h3 className="font-bold">Quick Alerts</h3>
                                    </div>
                                    <div className="space-y-6 opacity-50 pointer-events-none">
                                        <ToggleField label="Email Notifications" desc="Updates on project deadlines" active />
                                        <ToggleField label="Mention Alerts" desc="When someone tags you" active />
                                        <ToggleField label="Marketing" desc="Tips and new feature news" />
                                    </div>
                                    <p className="text-[10px] text-center text-muted-foreground italic">Integration pending</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button type="button" className="px-6 py-2.5 text-xs font-bold text-muted-foreground hover:text-white">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="px-8 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                                >
                                    {isUpdating && <Loader2 size={14} className="animate-spin" />}
                                    Save All Changes
                                </button>
                            </div>
                        </form>

                        {/* Danger Zone */}
                        <div className="glass rounded-3xl p-8 border-red-500/20 bg-red-500/[0.02]">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4 text-center md:text-left">
                                    <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-red-500 border-red-500/20">
                                        <Trash2 size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-red-500 mb-1">Delete Account</h4>
                                        <p className="text-xs text-muted-foreground max-w-xs">Permanently delete your account and all project data. This action cannot be undone.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="px-6 py-2.5 border border-red-500/20 text-red-500 text-xs font-bold rounded-xl hover:bg-red-500/10 transition-all font-bold"
                                >
                                    Delete My Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}



function NavButton({ icon, label, active = false }) {
    return (
        <button className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${active ? 'bg-primary/10 text-primary font-bold shadow-lg shadow-primary/[0.05]' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
            <div className="flex items-center gap-3 text-sm">
                {icon}
                <span>{label}</span>
            </div>
            {active && <ChevronRight size={14} />}
        </button>
    );
}

function ToggleField({ label, desc, active = false }) {
    return (
        <div className="flex items-center justify-between group cursor-pointer">
            <div>
                <div className="text-sm font-bold group-hover:text-primary transition-colors">{label}</div>
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{desc}</div>
            </div>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${active ? 'bg-primary' : 'bg-white/10'}`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${active ? 'right-0.5' : 'left-0.5'}`} />
            </div>
        </div>
    );
}
