import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getTasksByProject,
  createTask,
  updateTaskStatus,
  assignTaskMember
} from "../api/task.api";
import {
  getProjectMembers,
  addProjectMember,
  getProjectById
} from "../api/project.api";
import {
  Plus,
  Users,
  Filter,
  Search,
  MoreVertical,
  Clock,
  CheckCircle2,
  Circle,
  UserPlus,
  Mail,
  ChevronLeft,
  Calendar,
  Layers,
  FileText,
  Loader2
} from "lucide-react";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";
import { updateProject } from "../api/project.api";



export default function ProjectDetails() {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = location.state?.role;

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);


  // Form states
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskMemberEmail, setTaskMemberEmail] = useState("");
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState("MEMBER");


  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pRes, tRes, mRes] = await Promise.all([
        getProjectById(projectId),
        getTasksByProject(projectId),
        getProjectMembers(projectId)
      ]);
      setProject(pRes.data.data);
      setTasks(tRes.data.data || []);
      setMembers(mRes.data.data || []);
    } catch (err) {
      console.error("Failed to load project details", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const formData = new FormData();
    formData.append("title", taskTitle);
    formData.append("description", taskDesc);
    formData.append("deadline", taskDeadline);
    if (taskMemberEmail) {
      formData.append("assignedToEmail", taskMemberEmail);
    }

    await createTask(projectId, formData);
    setTaskTitle("");
    setTaskDesc("");
    setTaskDeadline("");
    setTaskMemberEmail("");
    setShowTaskForm(false);
    loadData();
  };

  const handleUpdateProjectStatus = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      await updateProject(projectId, { status: newStatus });
      loadData();
    } catch (err) {
      console.error("Failed to update project status", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };


  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail) return;

    await addProjectMember(projectId, {
      email: memberEmail,
      role: memberRole,
    });
    setMemberEmail("");
    setShowMemberForm(false);
    loadData();
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs font-bold uppercase tracking-widest">Loading Project Intelligence...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-8 pb-32">
        {/* Breadcrumbs & Actions Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Projects</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-bold">{project?.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowMemberForm(true)} className="px-4 py-2 border border-white/5 bg-white/5 rounded-xl text-xs font-bold hover:bg-white/10 flex items-center gap-2 transition-all">
              <UserPlus size={14} /> Invite
            </button>
            <button onClick={() => setShowTaskForm(true)} className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
              <Plus size={14} /> New Task
            </button>
          </div>
        </div>

        {/* Header Info */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight mb-4">{project?.name}</h1>
            <p className="text-muted-foreground leading-relaxed">{project?.description || "No description provided for this project."}</p>
          </div>
          <div className="glass p-6 rounded-[24px] space-y-4 min-w-[240px]">
            <div className="flex items-center justify-between text-xs tracking-widest font-bold uppercase text-muted-foreground">
              <span>Status</span>
              <div className="flex items-center gap-2">
                {project?.createdBy === user?._id ? (
                  <select
                    className="bg-transparent text-primary focus:outline-none cursor-pointer border-none p-0"
                    value={project?.status}
                    onChange={(e) => handleUpdateProjectStatus(e.target.value)}
                    disabled={isUpdatingStatus}
                  >
                    <option value="active">Active</option>
                    <option value="inprogress">In Progress</option>
                    <option value="end">Completed</option>
                  </select>
                ) : (
                  <span className="text-primary">{project?.status?.replace('_', ' ')}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-muted-foreground" />
              <div className="text-sm font-bold">
                {project?.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'} - {project?.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Layers size={16} className="text-muted-foreground" />
              <div className="text-sm font-bold">{tasks.length} Total Tasks</div>
            </div>
            <div className="flex -space-x-2 pt-2">
              {members.map((m, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#09090b] bg-primary flex items-center justify-center text-[10px] font-bold" title={m.user.username}>
                  {m.user.username.charAt(0).toUpperCase()}
                </div>
              ))}
              {members.length > 5 && (
                <div className="w-8 h-8 rounded-full border-2 border-[#09090b] glass flex items-center justify-center text-[10px] font-bold">
                  +{members.length - 5}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Task Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TaskColumn
            title="To Do"
            tasks={tasks.filter(t => t.status === 'TODO')}
            color="bg-primary/5 text-primary border-primary/20"
            onStatusChange={(taskId, status) => handleUpdateStatus(taskId, status)}
            loadData={loadData}
          />
          <TaskColumn
            title="In Progress"
            tasks={tasks.filter(t => t.status === 'IN_PROGRESS')}
            color="bg-yellow-500/5 text-yellow-500 border-yellow-500/20"
            onStatusChange={(taskId, status) => handleUpdateStatus(taskId, status)}
            loadData={loadData}
          />
          <TaskColumn
            title="Done"
            tasks={tasks.filter(t => t.status === 'DONE')}
            color="bg-green-500/5 text-green-500 border-green-500/20"
            onStatusChange={(taskId, status) => handleUpdateStatus(taskId, status)}
            loadData={loadData}
          />
        </div>
      </div>

      {/* Overlays / Modals */}
      <AnimatePresence>
        {showTaskForm && (
          <Overlay title="New Task" onClose={() => setShowTaskForm(false)}>
            <form onSubmit={handleCreateTask} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1">Title</label>
                <input
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-primary focus:outline-none"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="What needs to be done?"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1">Description</label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-primary focus:outline-none min-h-[120px]"
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Provide more details..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1">Deadline</label>
                  <input
                    type="date"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-primary focus:outline-none"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1">Assign to (Email)</label>
                  <input
                    type="email"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-1 focus:ring-primary focus:outline-none"
                    value={taskMemberEmail}
                    onChange={(e) => setTaskMemberEmail(e.target.value)}
                    placeholder="teammate@email.com"
                  />
                </div>
              </div>

              <button className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                <Plus size={20} /> Create Task
              </button>
            </form>
          </Overlay>
        )}

        {showMemberForm && (
          <Overlay title="Invite Member" onClose={() => setShowMemberForm(false)}>
            <form onSubmit={handleAddMember} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    autoFocus
                    type="email"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:ring-1 focus:ring-primary focus:outline-none"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="teammate@company.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1">Role</label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 appearance-none focus:ring-1 focus:ring-primary focus:outline-none"
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <button className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                <UserPlus size={20} /> Send Invitation
              </button>
            </form>
          </Overlay>
        )}
      </AnimatePresence>
    </AppShell>
  );
}


function TaskColumn({ title, tasks, color, loadData }) {
  const handleUpdateStatus = async (taskId, newStatus) => {
    await updateTaskStatus(taskId, newStatus);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className={`flex items-center justify-between px-4 py-2 rounded-xl border ${color} font-bold text-xs uppercase tracking-widest`}>
        <span>{title}</span>
        <span className="opacity-50">{tasks.length}</span>
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <motion.div
            layoutId={task._id}
            key={task._id}
            className="glass p-6 rounded-2xl border border-white/5 hover:bg-white/[0.07] transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold leading-snug group-hover:text-primary transition-colors">{task.title}</h4>
              <button className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all">
                <MoreVertical size={16} />
              </button>
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
                {task.description}
              </p>
            )}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <Clock size={12} />
                <span>2 days left</span>
              </div>
              <select
                className="bg-transparent text-[10px] font-bold uppercase tracking-widest focus:outline-none cursor-pointer"
                value={task.status}
                onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">Working</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </motion.div>
        ))}
        {tasks.length === 0 && (
          <div className="h-40 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center text-muted-foreground/30 text-xs uppercase font-bold tracking-[0.2em]">
            No tasks in {title}
          </div>
        )}
      </div>
    </div>
  );
}

function Overlay({ title, children, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-lg glass bg-[#0c0c0e] rounded-[32px] overflow-hidden shadow-2xl"
      >
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground">&times;</button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
