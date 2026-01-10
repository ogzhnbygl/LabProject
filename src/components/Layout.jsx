import { FileText, LogOut, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Layout({ children, currentView, onViewChange }) {
    const { logout, user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                            <FileText size={24} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-800">LabProject Manager</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Navigation */}
                        <nav className="flex gap-1 bg-slate-100/50 p-1 rounded-lg">
                            <button
                                onClick={() => onViewChange('projects')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${currentView === 'projects'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Projeler
                            </button>
                            <button
                                onClick={() => onViewChange('timeline')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${currentView === 'timeline'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Takvim
                            </button>
                        </nav>

                        {/* User Profile & Logout */}
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            {user && (
                                <span className="text-sm font-medium text-slate-600 hidden sm:block">
                                    {user.name || user.email}
                                </span>
                            )}
                            <button
                                onClick={logout}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="Çıkış Yap"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>
        </div>
    );
}
