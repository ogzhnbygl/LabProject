import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import ProjectList from './pages/ProjectList';
import ProjectForm from './pages/ProjectForm';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [editingProject, setEditingProject] = useState(null);

    // Auth check logic (Proxy to Apex)
    useEffect(() => {
        // Basic auth check placeholder - will implement fully later
        setLoading(false);
    }, []);

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
                setCurrentView('projects');
            } else {
                alert('Error saving project');
            }
        } catch (e) {
            console.error(e);
            alert('Network error');
        }
    };

    const handleEditProject = (project) => {
        setCurrentView('edit-project');
        // We'll pass this project to the form
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
                setCurrentView('projects');
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
                setCurrentView('projects');
            } else {
                alert('Error deleting project');
            }
        } catch (e) {
            console.error(e);
            alert('Network error');
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    const onProjectClick = (project) => {
        setEditingProject(project);
        setCurrentView('edit-project');
    };

    return (
        <Layout user={user} currentView={currentView} onViewChange={setCurrentView}>
            {currentView === 'projects' && (
                <ProjectList
                    projects={projects}
                    onNewProject={() => {
                        setEditingProject(null);
                        setCurrentView('new-project');
                    }}
                    onProjectClick={onProjectClick}
                />
            )}
            {currentView === 'new-project' && (
                <ProjectForm
                    onCancel={() => setCurrentView('projects')}
                    onSave={handleSaveProject}
                />
            )}
            {currentView === 'edit-project' && (
                <ProjectForm
                    initialData={editingProject}
                    onCancel={() => setCurrentView('projects')}
                    onSave={handleUpdateProject}
                    onDelete={handleDeleteProject}
                />
            )}
            {currentView === 'timeline' && (
                <div className="text-center text-slate-500 mt-10">Takvim Özelliği Yapım Aşamasında</div>
            )}
        </Layout>
    );
}

export default App;
