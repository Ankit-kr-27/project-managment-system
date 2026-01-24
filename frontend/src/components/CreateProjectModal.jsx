import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createProject } from "../api/project.api";
import { X, Calendar, Type, FileText, Plus, Loader2 } from "lucide-react";

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [deadline, setDeadline] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("Project name is required");
            return;
        }

        setIsLoading(true);

        try {
            await createProject({
                name,
                description,
                startDate: startDate || undefined,
                deadline: deadline || undefined,
            });

            // Reset form
            setName("");
            setDescription("");
            setStartDate("");
            setDeadline("");

            onProjectCreated?.();
            onClose();
        } catch (err) {
            console.error("Failed to create project", err);
            setError(err.response?.data?.message || "Failed to create project");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="w-full max-w-lg glass bg-[#0c0c0e] rounded-[32px] overflow-hidden shadow-2xl border border-white/5"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Create Project</h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Start something new</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-xl text-muted-foreground hover:text-white transition-all hover:rotate-90"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1 flex items-center gap-2">
                                    <Type size={14} /> Project Name
                                </label>
                                <input
                                    autoFocus
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-primary focus:outline-none transition-all focus:bg-white/[0.07]"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Website Redesign"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1 flex items-center gap-2">
                                    <FileText size={14} /> Description
                                </label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-primary focus:outline-none min-h-[100px] resize-none transition-all focus:bg-white/[0.07]"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What is this project about?"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1 flex items-center gap-2">
                                        <Calendar size={14} /> Start Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-primary focus:outline-none transition-all focus:bg-white/[0.07] [color-scheme:dark]"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1 flex items-center gap-2">
                                        <Calendar size={14} /> Deadline
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-primary focus:outline-none transition-all focus:bg-white/[0.07] [color-scheme:dark]"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    disabled={isLoading}
                                    className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {isLoading ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Plus size={20} className="group-hover:scale-110 transition-transform" />
                                            Create Project
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
