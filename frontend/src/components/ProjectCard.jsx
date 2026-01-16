export function ProjectCard({ project }) {
return (
<div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-indigo-500 transition">
<h3 className="text-white text-lg font-semibold mb-2">
{project.name}
</h3>
<p className="text-gray-400 text-sm mb-4">
{project.description}
</p>
<span className="inline-block px-3 py-1 text-xs rounded-full bg-indigo-600/20 text-indigo-400">
{project.role}
</span>
</div>
);
}