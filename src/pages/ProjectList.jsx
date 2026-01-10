import React, { useState } from 'react';
import { Plus, Search, Calendar, AlertCircle, FileText } from 'lucide-react';

export default function ProjectList({ onNewProject, projects = [] }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter projects
    const filteredProjects = projects.filter(p =>
        p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.pi.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        placeholder="Proje kodu, başlık veya yürütücü ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project) => (
                    <div key={project.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-md text-sm">
                                {project.code}
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${project.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                {project.status === 'Active' ? 'Aktif' : 'Süresi Dolmuş'}
                            </span>
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-800 line-clamp-2">{project.title}</h3>
                            <p className="text-sm text-slate-500 mt-1">{project.pi}</p>
                        </div>

                        <div className="border-t border-slate-100 pt-3 mt-auto flex items-center justify-between text-sm text-slate-500">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={16} />
                                <span>Bitiş: {project.endDate}</span>
                            </div>
                            {project.status === 'Expired' && (
                                <AlertCircle size={16} className="text-red-500" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
