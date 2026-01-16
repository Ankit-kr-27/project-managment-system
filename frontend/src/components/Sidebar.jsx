import { LayoutDashboard, FolderKanban, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";


export function Sidebar() {
return (
<aside className="w-64 bg-[#0b0f1a] border-r border-white/10 text-white flex flex-col">
<div className="p-6 text-xl font-semibold">ProjectFlow</div>


<nav className="flex-1 px-4 space-y-2">
<NavLink
to="/dashboard"
className={({ isActive }) =>
`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
isActive ? "bg-indigo-600" : "hover:bg-white/10"
}`
}
>
<LayoutDashboard size={18} /> Dashboard
</NavLink>


<NavLink
to="/dashboard"
className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10"
>
<FolderKanban size={18} /> Projects
</NavLink>
</nav>


<div className="p-4">
<button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg">
<Plus size={16} /> New Project
</button>
</div>
</aside>
);
}