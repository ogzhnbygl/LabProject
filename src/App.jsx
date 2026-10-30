import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Layout } from './components/Layout';
import ProjectList from './pages/ProjectList';
import ProjectForm from './pages/ProjectForm';
import ProjectReports from './pages/ProjectReports';
import ProjectCalendar from './pages/ProjectCalendar';
import { useAuth } from './context/AuthContext';

function EditProjectRoute({ cachedProject, onProjectLoaded, onCancel, onSave, onDelete }) {
    const { id } = useParams();
    const [project, setProject] = useState(() =>
        cachedProject && cachedProject.id === id ? cachedProject : null
    );
    const [loading, setLoading] = useState(!project);
    const [error, setError] = useState('');

    useEffect(() => {
        if (cachedProject && cachedProject.id === id) {
            setProject(cachedProject);
            setLoading(false);
            setError('');
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError('');

        fetch(`/api/projects?id=${encodeURIComponent(id)}`)
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                    throw new Error(data.error || 'Proje bulunamadı.');
                }
                if (!cancelled) {
                    setProject(data);
                    onProjectLoaded(data);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err.message || 'Proje detayları yüklenirken bir hata oluştu.');
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [id, cachedProject, onProjectLoaded]);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center text-slate-500">
                Proje detayları yükleniyor...
            </div>
        );
    }

    if (error || !project) {
        return (
            <div role="alert" className="max-w-3xl mx-auto bg-white p-8 rounded-xl border border-red-200 shadow-sm text-center space-y-4">
                <p className="text-red-600 font-medium">{error || 'Proje bulunamadı.'}</p>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                    Proje Listesine Dön
                </button>
            </div>
        );
    }

    return (
        <ProjectForm
            key={project.id}
            initialData={project}
            onCancel={onCancel}
            onSave={onSave}
            onDelete={onDelete}
        />
    );
}

function MainApp() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [editingProject, setEditingProject] = useState(null);

    // Pagination/filter states for Projects view (can be kept in state)
    const [paginationState, setPaginationState] = useState({ currentPage: 1, itemsPerPage: 10 });
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch Projects
    useEffect(() => {
        fetch('/api/projects')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setProjects(data);
            })
            .catch(err => console.error('Failed to fetch projects:', err));
    }, [refreshTrigger]);

    const handleSaveProject = async (data) => {
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                setRefreshTrigger(prev => prev + 1);
                navigate('/');
                setPaginationState(prev => ({ ...prev, currentPage: 1 }));
                setStatusFilter('All');
                setSearchTerm('');
                return true;
            } else {
                const errData = await res.json().catch(() => ({}));
                alert(errData.error || 'Proje kaydedilirken bir hata oluştu.');
                return false;
            }
        } catch (e) {
            console.error(e);
            alert('Bağlantı hatası oluştu.');
            return false;
        }
    };

    const handleUpdateProject = async (data) => {
        try {
            const res = await fetch('/api/projects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                setEditingProject(null);
                setRefreshTrigger(prev => prev + 1);
                navigate('/');
                return true;
            } else {
                const errData = await res.json().catch(() => ({}));
                alert(errData.error || 'Proje güncellenirken bir hata oluştu.');
                return false;
            }
        } catch (e) {
            console.error(e);
            alert('Bağlantı hatası oluştu.');
            return false;
        }
    };

    const handleDeleteProject = async (id) => {
        if (!confirm('Projeyi silmek istediğinize emin misiniz?')) return;

        try {
            const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setEditingProject(null);
                setRefreshTrigger(prev => prev + 1);
                navigate('/');
            } else {
                const errData = await res.json().catch(() => ({}));
                alert(errData.error || 'Proje silinirken bir hata oluştu.');
            }
        } catch (e) {
            console.error(e);
            alert('Bağlantı hatası oluştu.');
        }
    };

    const onProjectClick = async (projectSummary) => {
        try {
            const res = await fetch(`/api/projects?id=${encodeURIComponent(projectSummary.id)}`);
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Proje detayları alınamadı.');
            }
            const fullProject = await res.json();
            setEditingProject(fullProject);
            navigate(`/edit/${projectSummary.id}`);
        } catch (e) {
            console.error(e);
            alert(`Proje detayları yüklenirken hata: ${e.message}`);
        }
    };

    return (
        <Layout>
            <Routes>
                <Route path="/" element={
                    <ProjectList
                        projects={projects}
                        onNewProject={() => {
                            setEditingProject(null);
                            navigate('/new');
                        }}
                        onProjectClick={onProjectClick}
                        paginationState={paginationState}
                        setPaginationState={setPaginationState}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                } />
                <Route path="/new" element={
                    <ProjectForm
                        onCancel={() => navigate('/')}
                        onSave={handleSaveProject}
                    />
                } />
                <Route path="/edit/:id" element={
                    <EditProjectRoute
                        cachedProject={editingProject}
                        onProjectLoaded={setEditingProject}
                        onCancel={() => navigate('/')}
                        onSave={handleUpdateProject}
                        onDelete={handleDeleteProject}
                    />
                } />
                <Route path="/edit" element={<Navigate to="/" replace />} />
                <Route path="/timeline" element={<ProjectCalendar />} />
                <Route path="/reports" element={<ProjectReports projects={projects} />} />
            </Routes>
        </Layout>
    );
}

function App() {
    return (
        <BrowserRouter>
            <MainApp />
        </BrowserRouter>
    );
}

export default App;
