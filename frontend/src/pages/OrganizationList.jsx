import { useEffect, useState } from "react";
import { getUserOrganizations } from "../api/organization.api";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowRight, Building2 } from "lucide-react";

export default function OrganizationList() {
    const [organizations, setOrganizations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadOrgs = async () => {
            try {
                const res = await getUserOrganizations();
                setOrganizations(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Failed to load organizations", err);
            }
        };
        loadOrgs();
    }, []);

    const handleSelectOrg = (orgId) => {
        localStorage.setItem("currentOrganizationId", orgId);
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-4xl space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">Your Organizations</h1>
                    <p className="text-muted-foreground">Select an organization to continue or create a new one.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <button
                        onClick={() => navigate("/create-organization")}
                        className="group flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border-2 border-dashed border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all text-muted-foreground hover:text-primary"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white/5 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                            <Plus size={32} />
                        </div>
                        <span className="font-bold uppercase tracking-widest text-xs">Create New Organization</span>
                    </button>

                    {organizations.map((org) => (
                        <div
                            key={org._id}
                            onClick={() => handleSelectOrg(org._id)}
                            className="group relative p-8 rounded-3xl bg-[#18181b] border border-white/5 hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                                <ArrowRight className="text-primary" />
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                                <Building2 size={24} className="text-white" />
                            </div>

                            <h3 className="text-xl font-bold mb-2">{org.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{org.description || "No description provided."}</p>

                            <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                {org.members?.length || 1} Members
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
