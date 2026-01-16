import { Sidebar } from "../components/Sidebar";
import { ProjectCard } from "../components/ProjectCard";
import Navbar from "../components/Navbar"; // reuse existing navbar


export default function Dashboard() {
// UI-only mock data
const projects = [
{
id: 1,
name: "Website Redesign",
description: "UI revamp for marketing site",
role: "ADMIN",
},
{
id: 2,
name: "Mobile App",
description: "Task management mobile app",
role: "MEMBER",
},
{
id: 3,
name: "Backend Refactor",
description: "Clean architecture & API optimization",
role: "ADMIN",
},
];


return (
<div className="flex h-screen bg-[#0b0f1a]">
<Sidebar />


<div className="flex-1 flex flex-col">
<Navbar /> {/* reused navbar */}


<main className="flex-1 p-8 overflow-y-auto">
<div className="flex items-center justify-between mb-8">
<h1 className="text-2xl font-semibold text-white">Dashboard</h1>
<button className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white">
+ Create Project
</button>
</div>


<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
{projects.map((project) => (
<ProjectCard key={project.id} project={project} />
))}
</div>
</main>
</div>
</div>
);
}