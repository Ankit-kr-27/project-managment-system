import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  getTasksByProject,
  createTask,
  updateTaskStatus,
  assignTaskMember,
} from "../api/task.api";
import {
  getProjectMembers,
  addProjectMember,
  getProjectById,
} from "../api/project.api";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const location = useLocation();

  const userRole = location.state?.role; // ✅ FIXED (ADMIN / MEMBER)

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState("MEMBER");

  // ---------------- LOADERS ----------------

  const loadProject = async () => {
    const res = await getProjectById(projectId);
    setProject(res.data.data);
  };

  const loadTasks = async () => {
    const res = await getTasksByProject(projectId);
    setTasks(res.data.data || []);
  };

  const loadMembers = async () => {
    const res = await getProjectMembers(projectId);
    setMembers(res.data.data || []);
  };

  useEffect(() => {
    loadProject();
    loadTasks();
    loadMembers();
  }, [projectId]);

  // ---------------- ACTIONS ----------------

  const handleCreateTask = async () => {
    if (!title.trim()) return alert("Task title required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    await createTask(projectId, formData);
    setTitle("");
    setDescription("");
    loadTasks();
  };

  const handleAddMember = async () => {
    if (!memberEmail) return alert("Email required");

    await addProjectMember(projectId, {
      email: memberEmail,
      role: memberRole,
    });

    setMemberEmail("");
    setMemberRole("MEMBER");
    loadMembers();
  };

  // ---------------- UI ----------------

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>
      <h2>Project Details</h2>

      {/* ✅ PROJECT DEADLINE */}
      {project?.deadline && (
        <div style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
          Deadline: {new Date(project.deadline).toLocaleDateString()}
        </div>
      )}

      {/* ---------- TASK CREATION ---------- */}
      <div style={{ marginBottom: "20px" }}>
        <h4>Create Task</h4>
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: "6px" }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", marginBottom: "6px" }}
        />
        <button onClick={handleCreateTask}>Add Task</button>
      </div>

      {/* ---------- TASK LIST ---------- */}
      <h4>Tasks</h4>
      {tasks.length === 0 && <div>No tasks yet</div>}

      {tasks.map((task) => (
        <div
          key={task._id}
          style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "8px" }}
        >
          <strong>{task.title}</strong>

<div style={{ marginTop: "6px", display: "flex", gap: "8px" }}>
  {/* Task Status */}
  <select
    value={task.status}
    onChange={async (e) => {
      await updateTaskStatus(task._id, e.target.value);
      loadTasks();
    }}
  >
    <option value="TODO">TODO</option>
    <option value="IN_PROGRESS">IN_PROGRESS</option>
    <option value="DONE">DONE</option>
  </select>

  {/* Assign Member (ADMIN only) */}
  {userRole === "ADMIN" && (
    <select
      value={task.assignedTo?._id || ""}
      onChange={async (e) => {
        await assignTaskMember(task._id, e.target.value);
        loadTasks();
      }}
    >
      <option value="">Unassigned</option>
      {members.map((m) => (
        <option key={m.user._id} value={m.user._id}>
          {m.user.username}
        </option>
      ))}
    </select>
  )}
</div>

        </div>
      ))}

      {/* ---------- MEMBER MANAGEMENT (ADMIN ONLY) ---------- */}
      {userRole === "ADMIN" && (
        <div style={{ marginTop: "30px" }}>
          <h4>Add Project Member</h4>

          <input
            placeholder="Member email"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            style={{ marginRight: "8px" }}
          />

          <select
            value={memberRole}
            onChange={(e) => setMemberRole(e.target.value)}
          >
            <option value="MEMBER">MEMBER</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <button onClick={handleAddMember} style={{ marginLeft: "8px" }}>
            Add
          </button>
        </div>
      )}

      {/* ---------- MEMBER LIST ---------- */}
      <div style={{ marginTop: "20px" }}>
        <h4>Project Members</h4>
        {members.map((m, i) => (
          <div key={i}>
            {m.user.username} ({m.role})
          </div>
        ))}
      </div>
    </div>
  );
}
