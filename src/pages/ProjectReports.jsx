import React from 'react';
import { FileText, Activity, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function ProjectReports({ projects = [] }) {
    // Calculate stats
    const stats = {
        all: projects.length,
        active: projects.filter(p => p.status === 'Active').length,
        continuing: projects.filter(p => p.status === 'Continuing').length,
        completed: projects.filter(p => p.status === 'Completed').length,
        cancelled: projects.filter(p => p.status === 'Cancelled').length,
        expired: projects.filter(p => !['Active', 'Continuing', 'Completed', 'Cancelled'].includes(p.status)).length
    };

    const cards = [
        {
            title: 'Tümü',
            count: stats.all,
            icon: FileText,
            color: 'bg-indigo-50 text-indigo-600',
            borderColor: 'border-indigo-100'
        },
        {
            title: 'Aktif',
            count: stats.active,
            icon: Activity,
            color: 'bg-green-50 text-green-600',
            borderColor: 'border-green-100'
        },
        {
            title: 'Devam Ediyor',
            count: stats.continuing,
            icon: Clock,
            color: 'bg-emerald-50 text-emerald-600',
            borderColor: 'border-emerald-100'
        },
        {
            title: 'Tamamlandı',
            count: stats.completed,
            icon: CheckCircle,
            color: 'bg-blue-50 text-blue-600',
            borderColor: 'border-blue-100'
        },
        {
            title: 'İptal Edildi',
            count: stats.cancelled,
            icon: XCircle,
            color: 'bg-slate-50 text-slate-600',
            borderColor: 'border-slate-200'
        },
        {
            title: 'Süresi Dolmuş',
            count: stats.expired,
            icon: AlertTriangle,
            color: 'bg-red-50 text-red-600',
            borderColor: 'border-red-100'
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Proje Raporları</h2>
                <p className="text-slate-500 mt-1">Proje durumları ve genel istatistikler</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className={`bg-white p-6 rounded-xl border ${card.borderColor} shadow-sm hover:shadow-md transition-shadow`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                                <h3 className="text-3xl font-bold text-slate-800 mt-2">{card.count}</h3>
                            </div>
                            <div className={`p-3 rounded-lg ${card.color}`}>
                                <card.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
