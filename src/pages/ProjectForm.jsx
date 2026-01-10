import React, { useState } from 'react';
import { Save, X, Plus, Trash2, Upload } from 'lucide-react';

export default function ProjectForm({ onCancel, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        pi: '',
        startDate: '',
        endDate: '',
        ethicsDate: '',
        quotas: [{ species: 'Mouse', strain: 'C57BL/6', count: 0 }]
    });

    const handleQuotaChange = (index, field, value) => {
        const newQuotas = [...formData.quotas];
        newQuotas[index][field] = value;
        setFormData({ ...formData, quotas: newQuotas });
    };

    const addQuota = () => {
        setFormData({
            ...formData,
            quotas: [...formData.quotas, { species: 'Mouse', strain: '', count: 0 }]
        });
    };

    const removeQuota = (index) => {
        const newQuotas = formData.quotas.filter((_, i) => i !== index);
        setFormData({ ...formData, quotas: newQuotas });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Yeni Proje Tanımla</h2>
                <button onClick={onCancel} className="text-slate-500 hover:text-slate-700">
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Proje Künyesi</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Proje Başlığı</label>
                            <input
                                required
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Proje Kodu (Etik No)</label>
                            <input
                                required
                                type="text"
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value })}
                                placeholder="Örn: 2024/001"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Yürütücü (PI)</label>
                            <input
                                required
                                type="text"
                                value={formData.pi}
                                onChange={e => setFormData({ ...formData, pi: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Başlangıç Tarihi</label>
                            <input
                                required
                                type="date"
                                value={formData.startDate}
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Bitiş Tarihi</label>
                            <input
                                required
                                type="date"
                                value={formData.endDate}
                                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Quotas */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="text-lg font-semibold text-slate-700">Hayvan Kotaları</h3>
                        <button type="button" onClick={addQuota} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                            <Plus size={16} /> Ekle
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.quotas.map((quota, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-3 items-end">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Tür</label>
                                    <select
                                        value={quota.species}
                                        onChange={e => handleQuotaChange(idx, 'species', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    >
                                        <option>Mouse</option>
                                        <option>Rat</option>
                                        <option>Rabbit</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Suş</label>
                                    <input
                                        type="text"
                                        value={quota.strain}
                                        onChange={e => handleQuotaChange(idx, 'strain', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        placeholder="Örn: C57BL/6"
                                    />
                                </div>
                                <div className="w-24">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Sayı</label>
                                    <input
                                        type="number"
                                        value={quota.count}
                                        onChange={e => handleQuotaChange(idx, 'count', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    />
                                </div>
                                <button type="button" onClick={() => removeQuota(idx)} className="p-2 text-slate-400 hover:text-red-500 pb-2.5">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Upload Placeholder */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 border-dashed border-2 flex flex-col items-center justify-center text-center">
                    <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                        <Upload className="text-blue-600" size={24} />
                    </div>
                    <h3 className="font-semibold text-slate-800">Otomatik Doldur (AI)</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm">Etik kurul karar dosyanızı (.docx) buraya yükleyerek formu otomatik doldurabilirsiniz.</p>
                    <button type="button" disabled className="mt-4 px-4 py-2 bg-blue-100 text-blue-400 rounded-lg text-sm font-medium cursor-not-allowed">
                        Henüz Aktif Değil
                    </button>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onCancel} className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
                        İptal
                    </button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2">
                        <Save size={20} />
                        Projeyi Kaydet
                    </button>
                </div>
            </form>
        </div>
    );
}
