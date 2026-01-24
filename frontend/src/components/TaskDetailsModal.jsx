import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Clock, CheckCircle2, AlertCircle, FileText, UserCircle } from "lucide-react";

export default function TaskDetailsModal({ isOpen, onClose, task }) {
    if (!task) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'todo': return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
            case 'in_progress': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'done': return 'text-green-400 bg-green-400/10 border-green-400/20';
            default: return 'text-zinc-400';
        }
    };

    const formatStatus = (status) => {
        return status?.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="w-full max-w-2xl glass bg-[#0c0c0e] rounded-[32px] overflow-hidden shadow-2xl border border-white/5"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${getStatusColor(task.status)}`}>
                                    {formatStatus(task.status)}
                                </div>
                                {task.deadline && (
                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        <Clock size={12} />
                                        {new Date(task.deadline).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-xl text-muted-foreground hover:text-white transition-all hover:rotate-90"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            {/* Title & Desc */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold leading-tight">{task.title}</h2>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {task.description || "No description provided."}
                                </p>
                            </div>

                            {/* People */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="glass p-4 rounded-2xl border border-white/5 space-y-3">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                        <User size={14} /> Assigned To
                                    </span>
                                    {task.assignedTo ? (
                                        <div className="flex items-center gap-3">
                                            {task.assignedTo.avatar?.url ? (
                                                <img src={task.assignedTo.avatar.url} className="w-10 h-10 rounded-full object-cover border border-white/10" alt="Avatar" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/20">
                                                    {task.assignedTo.username?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-sm">{task.assignedTo.fullName || task.assignedTo.username}</div>
                                                <div className="text-xs text-muted-foreground">{task.assignedTo.email}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground italic">Unassigned</div>
                                    )}
                                </div>

                                <div className="glass p-4 rounded-2xl border border-white/5 space-y-3">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                        <UserCircle size={14} /> Created By
                                    </span>
                                    {task.assignedBy ? ( // Note: assignedBy is typically the creator in this schema
                                        <div className="flex items-center gap-3">
                                            {task.assignedBy.avatar?.url ? (
                                                <img src={task.assignedBy.avatar.url} className="w-10 h-10 rounded-full object-cover border border-white/10" alt="Avatar" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground font-bold border border-white/10">
                                                    {task.assignedBy.username?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-sm">{task.assignedBy.fullName || task.assignedBy.username}</div>
                                                <div className="text-xs text-muted-foreground">Original Author</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground italic">Unknown</div>
                                    )}
                                </div>
                            </div>

                            {/* Attachments Section (Placeholder as backend supports it but mostly unused) */}
                            {task.attachments && task.attachments.length > 0 && (
                                <div className="space-y-3">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                        <FileText size={14} /> Attachments
                                    </span>
                                    <div className="grid grid-cols-2 gap-4">
                                        {task.attachments.map((file, i) => (
                                            <a
                                                key={i}
                                                href={file.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                                        <FileText size={16} />
                                                    </div>
                                                    <div className="text-sm font-bold truncate">Attachment {i + 1}</div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
