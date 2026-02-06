import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import { getProjects, getProjectMembers } from "../api/project.api";
import { Mail, Loader2 } from "lucide-react";

export default function Teams({ searchQuery = "" }) {
    const [teamMembers, setTeamMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAllMembers = async () => {
            try {
                const projRes = await getProjects();
                const projects = projRes.data.data;
                const memberPromises = projects.map(p => getProjectMembers(p.project._id));
                const memberResponses = await Promise.all(memberPromises);

                const allMembersMap = {};
                memberResponses.forEach(res => {
                    res.data.data.forEach(m => {
                        if (!allMembersMap[m.user._id]) {
                            allMembersMap[m.user._id] = {
                                ...m.user,
                                roles: [m.role],
                                projects: 1
                            };
                        } else {
                            if (!allMembersMap[m.user._id].roles.includes(m.role)) {
                                allMembersMap[m.user._id].roles.push(m.role);
                            }
                            allMembersMap[m.user._id].projects += 1;
                        }
                    });
                });

                setTeamMembers(Object.values(allMembersMap));
            } catch (err) {
                console.error("Failed to load team members", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadAllMembers();
    }, []);

    return (
        <AppShell>
            <div className="p-8 pb-32">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-2 text-glow">My Team</h1>
                    <p className="text-muted-foreground text-sm">Collaborators and team members across all your active projects.</p>
                </div>

                {isLoading ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-primary" />
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Compiling Team Data...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teamMembers
                            .filter(m =>
                                (m.fullName || m.username).toLowerCase().includes(searchQuery.toLowerCase()) ||
                                m.email.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((member) => (
                                <div key={member._id} className="glass p-6 rounded-[32px] border border-border hover:bg-white/[0.07] transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <div className="w-20 h-20 bg-primary rounded-full blur-3xl"></div>
                                    </div>

                                    <div className="flex items-center gap-4 mb-6 relative">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-border flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">
                                            {member.avatar?.url ? (
                                                <img src={member.avatar.url} alt={member.username} className="w-full h-full rounded-2xl object-cover shadow-2xl" />
                                            ) : (
                                                <span className="text-primary">{member.username.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{member.fullName || member.username}</h3>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                                                <Mail size={12} className="text-primary" />
                                                {member.email}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 relative">
                                        <div className="flex flex-wrap gap-2">
                                            {member.roles.map(role => (
                                                <span key={role} className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                                                    {role.replace('_', ' ')}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="pt-6 border-t border-border flex items-center justify-between">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Projects</span>
                                            <span className="px-3 py-1 bg-white/5 border border-border rounded-lg text-primary font-bold text-sm tracking-widest">{member.projects}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
}
