import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import ProjectList from './pages/ProjectList';
import ProjectForm from './pages/ProjectForm';
import ProjectReports from './pages/ProjectReports';
import ProjectCalendar from './pages/ProjectCalendar';
import { useAuth } from './context/AuthContext';

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
            } else {
                alert('Error saving project');
            }
        } catch (e) {
            console.error(e);
            alert('Network error');
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
                setRefreshTrigger(prev => prev + 1);
                navigate('/');
            } else {
                alert('Error updating project');
            }
        } catch (e) {
            console.error(e);
            alert('Network error');
        }
    };

    const handleDeleteProject = async (id) => {
        if (!confirm('Projeyi silmek istediğinize emin misiniz?')) return;

        try {
            const res = await fetch(`/api/projects?id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setRefreshTrigger(prev => prev + 1);
                navigate('/');
            } else {
                alert('Error deleting project');
            }
        } catch (e) {
            console.error(e);
            alert('Network error');
        }
    };

    const onProjectClick = async (projectSummary) => {
        try {
            const res = await fetch(`/api/projects?id=${projectSummary.id}`);
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to fetch project details');
            }
            const fullProject = await res.json();
            setEditingProject(fullProject);
            navigate('/edit');
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
                <Route path="/edit" element={
                    <ProjectForm
                        initialData={editingProject}
                        onCancel={() => navigate('/')}
                        onSave={handleUpdateProject}
                        onDelete={handleDeleteProject}
                    />
                } />
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
