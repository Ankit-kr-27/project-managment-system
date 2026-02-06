import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Clock, CheckCircle2, AlertCircle, FileText, UserCircle, Edit3, Trash2, Save, XCircle } from "lucide-react";

export default function TaskDetailsModal({ isOpen, onClose, task, onUpdate, onDelete, projectMembers = [] }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        if (task) {
            setEditData({
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : "",
                assignedTo: task.assignedTo?._id || ""
            });
        }
    }, [task]);

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

    const handleSave = async () => {
        await onUpdate(task._id, editData);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            await onDelete(task._id);
            onClose();
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
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="w-full max-w-2xl glass bg-[#0c0c0e] rounded-[32px] overflow-hidden shadow-2xl border border-border"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                                {!isEditing ? (
                                    <>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${getStatusColor(task.status)}`}>
                                            {formatStatus(task.status)}
                                        </div>
                                        {task.deadline && (
                                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                <Clock size={12} />
                                                {new Date(task.deadline).toLocaleDateString()}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-sm font-bold uppercase tracking-widest text-primary">Editing Task</div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {!isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="p-2 hover:bg-white/5 rounded-xl text-muted-foreground hover:text-primary transition-all"
                                            title="Edit Task"
                                        >
                                            <Edit3 size={18} />
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="p-2 hover:bg-white/5 rounded-xl text-muted-foreground hover:text-red-500 transition-all"
                                            title="Delete Task"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="p-2 hover:bg-green-500/10 rounded-xl text-green-500 transition-all flex items-center gap-2 text-xs font-bold uppercase"
                                        >
                                            <Save size={18} /> Save
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="p-2 hover:bg-white/5 rounded-xl text-muted-foreground hover:text-white transition-all flex items-center gap-2 text-xs font-bold uppercase"
                                        >
                                            <XCircle size={18} /> Cancel
                                        </button>
                                    </>
                                )}
                                <div className="w-px h-6 bg-white/10 mx-2" />
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/5 rounded-xl text-muted-foreground hover:text-white transition-all hover:rotate-90"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            {/* Title & Desc */}
                            <div className="space-y-4">
                                {!isEditing ? (
                                    <>
                                        <h2 className="text-2xl font-bold leading-tight">{task.title}</h2>
                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {task.description || "No description provided."}
                                        </p>
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        <input
                                            className="w-full bg-white/5 border border-border rounded-2xl py-3 px-4 focus:ring-1 focus:ring-primary focus:outline-none text-xl font-bold"
                                            value={editData.title}
                                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                            placeholder="Task Title"
                                        />
                                        <textarea
                                            className="w-full bg-white/5 border border-border rounded-2xl py-3 px-4 focus:ring-1 focus:ring-primary focus:outline-none min-h-[150px] resize-none"
                                            value={editData.description}
                                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                            placeholder="Description..."
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Status & Priority (Edit Mode Only or integrated) */}
                                {isEditing && (
                                    <div className="glass p-4 rounded-2xl border border-border space-y-4 col-span-full">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">Status</label>
                                                <select
                                                    className="w-full bg-white/5 border border-border rounded-xl py-2 px-3 focus:outline-none text-sm"
                                                    value={editData.status}
                                                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                                >
                                                    <option value="todo">To Do</option>
                                                    <option value="in_progress">Working</option>
                                                    <option value="done">Done</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">Priority</label>
                                                <select
                                                    className="w-full bg-white/5 border border-border rounded-xl py-2 px-3 focus:outline-none text-sm"
                                                    value={editData.priority}
                                                    onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                                                >
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">Deadline</label>
                                            <input
                                                type="date"
                                                className={`w-full bg-white/5 border border-border rounded-xl py-2 px-3 focus:outline-none text-sm ${theme === 'dark' ? '[color-scheme:dark]' : '[color-scheme:light]'}`}
                                                value={editData.deadline}
                                                onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* People */}
                                <div className="glass p-4 rounded-2xl border border-border space-y-3">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                        <User size={14} /> Assigned To
                                    </span>
                                    {!isEditing ? (
                                        task.assignedTo ? (
                                            <div className="flex items-center gap-3">
                                                {task.assignedTo.avatar?.url ? (
                                                    <img src={task.assignedTo.avatar.url} className="w-10 h-10 rounded-full object-cover border border-border" alt="Avatar" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/20">
                                                        {task.assignedTo.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-sm tracking-tight">{task.assignedTo.fullName || task.assignedTo.username}</div>
                                                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{task.assignedTo.email}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-muted-foreground italic">Unassigned</div>
                                        )
                                    ) : (
                                        <select
                                            className="w-full bg-white/5 border border-border rounded-xl py-2 px-3 focus:outline-none text-sm"
                                            value={editData.assignedTo}
                                            onChange={(e) => setEditData({ ...editData, assignedTo: e.target.value })}
                                        >
                                            <option value="">Unassigned</option>
                                            {projectMembers.map(m => (
                                                <option key={m.user._id} value={m.user._id}>
                                                    {m.user.username} ({m.user.email})
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                <div className="glass p-4 rounded-2xl border border-border space-y-3">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                        <UserCircle size={14} /> Created By
                                    </span>
                                    {task.assignedBy ? (
                                        <div className="flex items-center gap-3 opacity-60">
                                            {task.assignedBy.avatar?.url ? (
                                                <img src={task.assignedBy.avatar.url} className="w-10 h-10 rounded-full object-cover border border-border" alt="Avatar" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground font-bold border border-border">
                                                    {task.assignedBy.username?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-sm tracking-tight">{task.assignedBy.fullName || task.assignedBy.username}</div>
                                                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Original Author</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-muted-foreground italic">Unknown</div>
                                    )}
                                </div>
                            </div>

                            {/* Attachments Section */}
                            {task.attachments && task.attachments.length > 0 && (
                                <div className="space-y-3 pt-4 border-t border-border">
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
                                                className="block p-4 rounded-xl bg-white/5 border border-border hover:bg-white/10 transition-colors group"
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 rounded-lg bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                        <FileText size={16} />
                                                    </div>
                                                    <div className="text-sm font-bold truncate">File {i + 1}</div>
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
