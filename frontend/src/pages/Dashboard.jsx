import { useEffect, useState } from "react";
import { getProjects, createProject } from "../api/project.api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const navigate = useNavigate();

  const loadProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data.data || []);
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async () => {
    if (!name.trim()) return alert("Project name required");

    try {
      await createProject({
        name,
        description,
        deadline: deadline || undefined,
      });

      setName("");
      setDescription("");
      setDeadline("");
      loadProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <div
      style={{
        padding: "30px 16px",
        maxWidth: "700px",
        margin: "auto",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Dashboard</h2>

      {/* -------- Create Project Card -------- */}
      <div
        style={{
          background: "white",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
          marginBottom: "30px",
        }}
      >
        <h4 style={{ marginBottom: "12px" }}>Create Project</h4>

        <input
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "8px",
          }}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "8px",
            minHeight: "70px",
          }}
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={{
            width: "100%",
            marginBottom: "12px",
            padding: "8px",
          }}
        />

        <button>+ Create Project</button>
      </div>

      {/* -------- Project List -------- */}
      <h4 style={{ marginBottom: "12px" }}>Your Projects</h4>

      {projects.length === 0 && (
        <div style={{ color: "#666", fontSize: "14px" }}>
          No projects yet. Create one above.
        </div>
      )}

      {projects.map(
        (item) =>
          item.project && (
            <div
              key={item.project._id}
              onClick={() =>
                navigate(`/project/${item.project._id}`, {
                  state: { role: item.role },
                })
              }
              style={{
                background: "white",
                padding: "14px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                marginBottom: "12px",
                cursor: "pointer",
                transition: "transform 0.1s ease",
              }}
            >
              <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                {item.project.name}
              </div>

              <div style={{ fontSize: "13px", color: "#555" }}>
                Role: {item.role}
              </div>

              {item.project.deadline && (
                <div style={{ fontSize: "12px", color: "#777", marginTop: "4px" }}>
                  Deadline:{" "}
                  {new Date(item.project.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          )
      )}
    </div>
  );
}
