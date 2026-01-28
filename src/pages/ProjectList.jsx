import React, { useState } from 'react';
import { Plus, Search, Calendar, AlertCircle, FileText } from 'lucide-react';

export default function ProjectList({ onNewProject, projects = [], onProjectClick }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter projects
    // Filter and Sort projects
    const filteredProjects = projects
        .filter(p =>
            p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.pi.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => b.code.localeCompare(a.code, undefined, { numeric: true })); // Sort by Etik No (Code) Descending

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Projeler & Etik İzinler</h2>
                    <p className="text-slate-500 mt-1">Aktif araştırma projeleri ve etik kurul durumları</p>
                </div>
                <button
                    onClick={onNewProject}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>Yeni Proje</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Etik no, başlık veya yürütücü ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 whitespace-nowrap">Etik No</th>
                                <th className="px-6 py-4">Proje Adı</th>
                                <th className="px-6 py-4 whitespace-nowrap">Yürütücü</th>
                                <th className="px-6 py-4 whitespace-nowrap">Etik Başlangıç</th>
                                <th className="px-6 py-4 whitespace-nowrap">Etik Bitiş</th>
                                <th className="px-6 py-4 whitespace-nowrap">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProjects.map((project) => (
                                <tr
                                    key={project.id}
                                    onClick={() => onProjectClick && onProjectClick(project)}
                                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                        {project.code}
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate" title={project.title}>
                                        {project.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{project.pi}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{project.ethicsStartDate || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{project.ethicsEndDate || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${project.status === 'Active'
                                            ? 'bg-green-50 text-green-700 border-green-200'
                                            : project.status === 'Completed'
                                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                : 'bg-red-50 text-red-700 border-red-200'
                                            }`}>
                                            {project.status === 'Active' ? 'Aktif'
                                                : project.status === 'Completed' ? 'Tamamlandı'
                                                    : 'Süresi Dolmuş'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredProjects.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <div className="flex justify-center mb-3">
                            <FileText size={48} className="text-slate-300" />
                        </div>
                        <p className="text-lg font-medium text-slate-700">Kayıtlı proje bulunamadı</p>
                        <p className="text-sm">Yeni bir proje ekleyerek başlayabilirsiniz.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
