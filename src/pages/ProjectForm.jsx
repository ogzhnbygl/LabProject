import React, { useState } from 'react';
import { Save, X, Plus, Trash2, Check, AlertCircle } from 'lucide-react';

const SPECIES_STRAINS = {
    'Fare': ['BALB/c', 'C57BL/6', 'CD-1 (ICR)', 'Athymic Nude'],
    'Sıçan': ['Wistar', 'Sprague Dawley'],
    'Tavşan': ['New Zealand White']
};

export default function ProjectForm({ onCancel, onSave, onDelete, initialData }) {
    const [formData, setFormData] = useState(() => {
        if (initialData) {
            return {
                ...initialData,
                quotas: Array.isArray(initialData.quotas) && initialData.quotas.length > 0
                    ? initialData.quotas.map((q) => ({
                        species: q.species || 'Fare',
                        strain: q.strain || (SPECIES_STRAINS[q.species]?.[0] ?? 'BALB/c'),
                        sex: q.sex || 'Erkek',
                        count: Number(q.count) || 0,
                        used: Number(q.used) || 0
                    }))
                    : [{ species: 'Fare', strain: 'BALB/c', sex: 'Erkek', count: 0, used: 0 }]
            };
        }
        return {
            title: '',
            code: '',
            protocol: '',
            pi: '',
            startDate: '',
            endDate: '',
            ethicsStartDate: '',
            ethicsEndDate: '',
            status: 'Active',
            workRulesForm: false,
            projectNotebook: false,
            quotas: [{ species: 'Fare', strain: 'BALB/c', sex: 'Erkek', count: 0, used: 0 }]
        };
    });

    const [dateError, setDateError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const isEditing = !!initialData;

    const getDateValidationMessage = (data) => {
        if (data.ethicsStartDate && data.ethicsEndDate && data.ethicsStartDate > data.ethicsEndDate) {
            return 'Etik bitiş tarihi, etik başlangıç tarihinden önce olamaz.';
        }
        if (data.startDate && data.endDate && data.startDate > data.endDate) {
            return 'Proje bitiş tarihi, proje başlangıç tarihinden önce olamaz.';
        }
        return '';
    };

    const handleDateFieldChange = (field, value) => {
        const next = { ...formData, [field]: value };
        setFormData(next);
        if (dateError) {
            setDateError('');
        }
    };

    const handleDateFieldBlur = () => {
        const msg = getDateValidationMessage(formData);
        if (msg) setDateError(msg);
    };

    const handleQuotaChange = (index, field, value) => {
        const newQuotas = [...formData.quotas];
        newQuotas[index] = { ...newQuotas[index], [field]: value };
        // Reset strain if species changes to ensure validity
        if (field === 'species') {
            newQuotas[index].strain = SPECIES_STRAINS[value][0];
        }
        setFormData({ ...formData, quotas: newQuotas });
    };

    const addQuota = () => {
        setFormData({
            ...formData,
            quotas: [...formData.quotas, { species: 'Fare', strain: 'BALB/c', sex: 'Erkek', count: 0, used: 0 }]
        });
    };

    const removeQuota = (index) => {
        const newQuotas = formData.quotas.filter((_, i) => i !== index);
        setFormData({ ...formData, quotas: newQuotas });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const msg = getDateValidationMessage(formData);
        if (msg) {
            setDateError(msg);
            return;
        }
        setDateError('');
        setSubmitting(true);
        try {
            await onSave(formData);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                    {isEditing ? 'Projeyi Düzenle' : 'Yeni Proje Tanımla'}
                </h2>
                <div className="flex items-center gap-3">
                    {isEditing && onDelete && (
                        <button
                            type="button"
                            onClick={() => onDelete(formData.id)}
                            className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-1"
                        >
                            <Trash2 size={18} aria-hidden="true" /> Sil
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onCancel}
                        aria-label="Formu kapat"
                        className="text-slate-500 hover:text-slate-700"
                    >
                        <X size={24} aria-hidden="true" />
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div aria-live="polite">
                    {dateError && (
                        <div
                            role="alert"
                            className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium"
                        >
                            <AlertCircle size={18} className="shrink-0" aria-hidden="true" />
                            <span>{dateError}</span>
                        </div>
                    )}
                </div>

                {/* 1. Bölüm: Proje Bilgileri (Başlık ve Yürütücü) */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Proje Bilgileri</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="project-title" className="block text-sm font-medium text-slate-700 mb-1">Proje Başlığı</label>
                            <input
                                id="project-title"
                                name="title"
                                required
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="project-pi" className="block text-sm font-medium text-slate-700 mb-1">Yürütücü (PI)</label>
                            <input
                                id="project-pi"
                                name="pi"
                                required
                                type="text"
                                value={formData.pi}
                                onChange={e => setFormData({ ...formData, pi: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Bölüm: Etik Kurul Bilgileri */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Etik Kurul Bilgileri</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="project-code" className="block text-sm font-medium text-slate-700 mb-1">Etik No</label>
                            <input
                                id="project-code"
                                name="code"
                                required
                                type="text"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck={false}
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value })}
                                placeholder="Örn: 2024/001"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="project-protocol" className="block text-sm font-medium text-slate-700 mb-1">Protokol No</label>
                            <input
                                id="project-protocol"
                                name="protocol"
                                type="text"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck={false}
                                value={formData.protocol || ''}
                                onChange={e => setFormData({ ...formData, protocol: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="ethics-start-date" className="block text-sm font-medium text-slate-700 mb-1">Etik Başlangıç Tarihi</label>
                            <input
                                id="ethics-start-date"
                                name="ethicsStartDate"
                                required
                                type="date"
                                value={formData.ethicsStartDate || ''}
                                onChange={e => handleDateFieldChange('ethicsStartDate', e.target.value)}
                                onBlur={handleDateFieldBlur}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="ethics-end-date" className="block text-sm font-medium text-slate-700 mb-1">Etik Bitiş Tarihi</label>
                            <input
                                id="ethics-end-date"
                                name="ethicsEndDate"
                                required
                                type="date"
                                min={formData.ethicsStartDate || undefined}
                                value={formData.ethicsEndDate || ''}
                                onChange={e => handleDateFieldChange('ethicsEndDate', e.target.value)}
                                onBlur={handleDateFieldBlur}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Proje Zamanlaması ve Durum</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="project-start-date" className="block text-sm font-medium text-slate-700 mb-1">Proje Başlangıç Tarihi</label>
                                <input
                                    id="project-start-date"
                                    name="startDate"
                                    type="date"
                                    value={formData.startDate || ''}
                                    onChange={e => handleDateFieldChange('startDate', e.target.value)}
                                    onBlur={handleDateFieldBlur}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="project-end-date" className="block text-sm font-medium text-slate-700 mb-1">Proje Bitiş Tarihi</label>
                                <input
                                    id="project-end-date"
                                    name="endDate"
                                    type="date"
                                    min={formData.startDate || undefined}
                                    value={formData.endDate || ''}
                                    onChange={e => handleDateFieldChange('endDate', e.target.value)}
                                    onBlur={handleDateFieldBlur}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Status Section */}
                                    <div>
                                        <label htmlFor="project-status" className="block text-sm font-medium text-slate-700 mb-2">Durum</label>
                                        <select
                                            id="project-status"
                                            name="status"
                                            value={formData.status || 'Active'}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        >
                                            <option value="Active">Aktif</option>
                                            <option value="Continuing">Devam Ediyor</option>
                                            <option value="Completed">Tamamlandı</option>
                                            <option value="Cancelled">İptal Edildi</option>
                                            <option value="Expired">Süresi Dolmuş</option>
                                        </select>
                                    </div>

                                    {/* Compliance Section */}
                                    <div>
                                        <span className="block text-sm font-medium text-slate-700 mb-2">Kontroller</span>
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                aria-pressed={Boolean(formData.workRulesForm)}
                                                onClick={() => setFormData({ ...formData, workRulesForm: !formData.workRulesForm })}
                                                className={`flex-1 flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all text-left ${formData.workRulesForm
                                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${formData.workRulesForm ? 'bg-blue-500 border-blue-500' : 'border-slate-300 bg-white'
                                                    }`}>
                                                    {formData.workRulesForm && <Check size={14} className="text-white" aria-hidden="true" />}
                                                </div>
                                                <span className="text-sm font-medium select-none">Çalışma Kuralları</span>
                                            </button>

                                            <button
                                                type="button"
                                                aria-pressed={Boolean(formData.projectNotebook)}
                                                onClick={() => setFormData({ ...formData, projectNotebook: !formData.projectNotebook })}
                                                className={`flex-1 flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all text-left ${formData.projectNotebook
                                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${formData.projectNotebook ? 'bg-blue-500 border-blue-500' : 'border-slate-300 bg-white'
                                                    }`}>
                                                    {formData.projectNotebook && <Check size={14} className="text-white" aria-hidden="true" />}
                                                </div>
                                                <span className="text-sm font-medium select-none">Proje Defteri</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Hayvan Kotaları */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-slate-700">Hayvan Kotaları</h3>
                            <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                {formData.quotas.reduce((acc, q) => acc + (parseInt(q.used, 10) || 0), 0)} / {formData.quotas.reduce((acc, q) => acc + (parseInt(q.count, 10) || 0), 0)}
                            </span>
                        </div>
                        <button type="button" onClick={addQuota} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                            <Plus size={16} aria-hidden="true" /> Ekle
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.quotas.map((quota, idx) => {
                            const strainOptions = SPECIES_STRAINS[quota.species] || SPECIES_STRAINS['Fare'];
                            return (
                                <div key={idx} className="flex flex-col sm:flex-row gap-3 sm:items-end">
                                    <div className="flex-1">
                                        <label htmlFor={`quota-species-${idx}`} className="block text-xs font-medium text-slate-500 mb-1">Tür</label>
                                        <select
                                            id={`quota-species-${idx}`}
                                            value={quota.species}
                                            onChange={e => handleQuotaChange(idx, 'species', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        >
                                            {Object.keys(SPECIES_STRAINS).map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor={`quota-strain-${idx}`} className="block text-xs font-medium text-slate-500 mb-1">Suş</label>
                                        <select
                                            id={`quota-strain-${idx}`}
                                            value={quota.strain}
                                            onChange={e => handleQuotaChange(idx, 'strain', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        >
                                            {strainOptions.map(strain => (
                                                <option key={strain} value={strain}>{strain}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="sm:w-32">
                                        <label htmlFor={`quota-sex-${idx}`} className="block text-xs font-medium text-slate-500 mb-1">Cinsiyet</label>
                                        <select
                                            id={`quota-sex-${idx}`}
                                            value={quota.sex}
                                            onChange={e => handleQuotaChange(idx, 'sex', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        >
                                            <option value="Erkek">Erkek</option>
                                            <option value="Dişi">Dişi</option>
                                            <option value="Erkek ve Dişi">Erkek ve Dişi</option>
                                        </select>
                                    </div>
                                    <div className="sm:w-24">
                                        <label htmlFor={`quota-count-${idx}`} className="block text-xs font-medium text-slate-500 mb-1">Tahsis</label>
                                        <input
                                            id={`quota-count-${idx}`}
                                            type="number"
                                            min="0"
                                            value={quota.count ?? 0}
                                            onChange={e => handleQuotaChange(idx, 'count', Math.max(0, parseInt(e.target.value, 10) || 0))}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        />
                                    </div>
                                    <div className="sm:w-24">
                                        <label htmlFor={`quota-used-${idx}`} className="block text-xs font-medium text-slate-500 mb-1">Kullanılan</label>
                                        <input
                                            id={`quota-used-${idx}`}
                                            type="number"
                                            min="0"
                                            value={quota.used ?? 0}
                                            onChange={e => handleQuotaChange(idx, 'used', Math.max(0, parseInt(e.target.value, 10) || 0))}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeQuota(idx)}
                                        aria-label="Kota satırını sil"
                                        title="Kota satırını sil"
                                        className="p-2 text-slate-400 hover:text-red-500 pb-2.5 self-end"
                                    >
                                        <Trash2 size={20} aria-hidden="true" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onCancel} className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
                        İptal
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2 disabled:opacity-60"
                    >
                        <Save size={20} aria-hidden="true" />
                        {submitting ? 'Kaydediliyor...' : isEditing ? 'Projeyi Güncelle' : 'Projeyi Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
}
