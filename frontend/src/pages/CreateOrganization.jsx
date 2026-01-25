import { useState } from "react";
import { createOrganization } from "../api/organization.api";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function CreateOrganization() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            await createOrganization({ name, description });
            navigate("/organizations");
        } catch (err) {
            console.error("Failed to create organization", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-8">
            <div className="w-full max-w-md space-y-8">
                <button
                    onClick={() => navigate("/organizations")}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Organizations
                </button>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Create Organization</h1>
                    <p className="text-muted-foreground">Set up a new workspace for your team.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Organization Name</label>
                        <input
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="e.g. Acme Corp"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                        <textarea
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px]"
                            placeholder="What's this organization for?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={isSubmitting}
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                    >
                        {isSubmitting ? "Creating..." : "Create Workspace"}
                    </button>
                </form>
            </div>
        </div>
    );
}
