import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  Plus,
  Trash2,
  Edit2,
  LogOut,
  ArrowLeft,
  Code2,
  Printer,
  ShieldAlert,
  Save,
  X,
  Database,
  Tag,
  ExternalLink,
  Shield,
  Lock,
  UserPlus,
  LogIn,
  Check,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { auth } from '../firebase';
import {
  subscribeProjects,
  addProject,
  updateProject,
  deleteProject,
  seedInitialProjects
} from '../services/projectService';
import Logo from './Logo';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Data states
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('dev'); // 'dev' | '3d'
  const [loadingData, setLoadingData] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Modal / Editing states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'dev',
    status: 'In Development',
    tags: '',
    image: '',
    order: 1,
    externalLink: '',
    privacyPolicyLink: '',
    isActive: true,
    startedOn: todayStr,
    showFrom: todayStr,
    showTo: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();

  // Ensure search engines do not index login or admin portal pages
  useEffect(() => {
    let metaRobots = document.querySelector('meta[name="robots"]');
    let created = false;
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
      created = true;
    }
    const previousContent = metaRobots.getAttribute('content');
    metaRobots.setAttribute('content', 'noindex, nofollow');

    return () => {
      if (created) {
        metaRobots.remove();
      } else if (previousContent) {
        metaRobots.setAttribute('content', previousContent);
      } else {
        metaRobots.removeAttribute('content');
      }
    };
  }, []);

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to projects from Firestore
  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeProjects(
      (items) => {
        setProjects(items);
        setLoadingData(false);
      },
      (err) => {
        console.error('Error fetching projects in admin:', err);
        setLoadingData(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  // Auth Submit
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');

    const inputUser = username.trim();
    const inputPass = password.trim();

    if (!inputUser || !inputPass) {
      setAuthError("Credentials don't match.");
      return;
    }

    // Read expected admin credentials from environment variables
    const expectedUsername = (process.env.REACT_APP_ADMIN_USERNAME || 'skr').trim();
    const expectedPassword = (process.env.REACT_APP_ADMIN_PASSWORD || '123456').trim();

    // If env credentials are empty or missing
    if (!expectedUsername || !expectedPassword) {
      setAuthError("Credentials don't match.");
      return;
    }

    // Verify username and password
    const isUserMatch =
      inputUser.toLowerCase() === expectedUsername.toLowerCase() ||
      (expectedUsername.indexOf('@') === -1 &&
        inputUser.toLowerCase() === `${expectedUsername.toLowerCase()}@zasdevlabs.com`);

    const isPassMatch = inputPass === expectedPassword;

    if (!isUserMatch || !isPassMatch) {
      setAuthError("Credentials don't match.");
      return;
    }

    // Credentials match! Sign in to Firebase Auth for Firestore rules access
    const adminEmail = expectedUsername.includes('@')
      ? expectedUsername.toLowerCase()
      : `${expectedUsername.toLowerCase()}@zasdevlabs.com`;

    try {
      await signInWithEmailAndPassword(auth, adminEmail, expectedPassword);
    } catch (err) {
      // If user account doesn't exist in Firebase Auth yet, auto-provision single admin user
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/invalid-credential'
      ) {
        try {
          await createUserWithEmailAndPassword(auth, adminEmail, expectedPassword);
        } catch (createErr) {
          console.error('Firebase Admin Auto-provision error:', createErr);
          setAuthError("Credentials don't match.");
        }
      } else {
        console.error('Firebase Auth Signin error:', err);
        setAuthError("Credentials don't match.");
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    const today = new Date().toISOString().split('T')[0];
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      type: activeTab,
      status: 'In Development',
      tags: '',
      image: 'https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
      order: projects.filter(p => p.type === activeTab).length + 1,
      externalLink: '',
      privacyPolicyLink: '',
      isActive: true,
      startedOn: today,
      showFrom: today,
      showTo: ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (project) => {
    const today = new Date().toISOString().split('T')[0];
    setEditingId(project.id);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      type: project.type || 'dev',
      status: project.status || 'In Development',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || ''),
      image: project.image || '',
      order: project.order || 1,
      externalLink: project.externalLink || '',
      privacyPolicyLink: project.privacyPolicyLink || '',
      isActive: project.isActive !== undefined ? Boolean(project.isActive) : true,
      startedOn: project.startedOn || today,
      showFrom: project.showFrom || project.startedOn || today,
      showTo: project.showTo || ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Save Project
  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.title.trim()) {
      setFormError('Project title is required.');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Description is required.');
      return;
    }

    setSubmitting(true);
    const parsedTags = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const projectPayload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      status: formData.status,
      tags: parsedTags,
      image: formData.image.trim() || 'https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
      order: Number(formData.order) || 1,
      externalLink: formData.externalLink.trim(),
      privacyPolicyLink: formData.privacyPolicyLink.trim(),
      isActive: Boolean(formData.isActive),
      startedOn: formData.startedOn || todayStr,
      showFrom: formData.showFrom || formData.startedOn || todayStr,
      showTo: formData.showTo.trim() ? formData.showTo.trim() : null
    };

    try {
      if (editingId) {
        await updateProject(editingId, projectPayload);
        showSuccessMessage('Project updated successfully!');
      } else {
        await addProject(projectPayload);
        showSuccessMessage('New project added successfully!');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving project:', err);
      setFormError('Failed to save project to Firestore: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Active State directly from card
  const handleToggleActive = async (project) => {
    const currentActive = project.isActive !== undefined ? Boolean(project.isActive) : true;
    const nextActive = !currentActive;
    try {
      await updateProject(project.id, {
        ...project,
        isActive: nextActive
      });
      showSuccessMessage(`Project "${project.title}" set to ${nextActive ? 'Active' : 'Inactive'}`);
    } catch (err) {
      alert('Failed to update project active status: ' + err.message);
    }
  };

  // Delete Project
  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteProject(id);
        showSuccessMessage(`Deleted "${title}"`);
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('Failed to delete project: ' + err.message);
      }
    }
  };

  // Manual Seed
  const handleSeed = async () => {
    if (window.confirm('Seed default sample projects into Firestore?')) {
      try {
        await seedInitialProjects();
        showSuccessMessage('Default projects seeded into database!');
      } catch (err) {
        alert('Failed to seed: ' + err.message);
      }
    }
  };

  const showSuccessMessage = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => {
      setActionSuccess('');
    }, 3500);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-white font-body">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  // If NOT LOGGED IN -> Show Login / Register Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-background text-white font-body flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Background glow accent */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-surface border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={14} /> Back to Portfolio
            </Link>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-primary font-mono">
              <Lock size={12} /> Admin Portal
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="inline-block mb-3">
              <Logo />
            </div>
            <h1 className="font-heading text-2xl font-semibold text-white">
              Admin Login
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Manage live portfolio projects & 3D models stored in Firestore
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
              <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="skr"
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-white/10 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-white/10 text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              data-testid="admin-login-submit-btn"
              className="w-full py-3.5 px-4 rounded-xl bg-primary text-primary-fg font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <LogIn size={16} /> Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filter projects by current tab
  const activeProjects = projects
    .filter((p) => p.type === activeTab)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="min-h-screen bg-background text-white font-body">
      {/* Top Navbar */}
      <header className="bg-surface border-b border-white/5 px-6 py-4 sticky top-0 z-30 backdrop-blur-md bg-surface/90">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-xl bg-surface-container hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Back to Portfolio">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-semibold text-white text-lg">Portfolio Control Center</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">Live DB</span>
              </div>
              <p className="text-xs text-gray-400">Logged in as {user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSeed}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container border border-white/10 text-xs font-medium text-gray-300 hover:text-white hover:border-white/20 transition-all"
              title="Re-seed initial sample data if needed"
            >
              <Database size={14} />
              Seed Defaults
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-all"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Success Alert Banner */}
        {actionSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3 animate-fade-in">
            <Check size={18} className="text-emerald-400 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Tab Selection & Add New Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="inline-flex items-center bg-surface-container rounded-full p-1 border border-white/5">
            <button
              onClick={() => setActiveTab('dev')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'dev'
                  ? 'bg-primary text-primary-fg shadow-md shadow-primary/20'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Code2 size={16} />
              Dev Projects ({projects.filter((p) => p.type === 'dev').length})
            </button>
            <button
              onClick={() => setActiveTab('3d')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === '3d'
                  ? 'bg-secondary text-secondary-fg shadow-md shadow-secondary/20'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Printer size={16} />
              3D Printing ({projects.filter((p) => p.type === '3d').length})
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            data-testid="admin-add-project-btn"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-fg font-medium text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            <Plus size={16} /> Add {activeTab === 'dev' ? 'Dev Project' : '3D Project'}
          </button>
        </div>

        {/* Projects Table / Cards */}
        {loadingData ? (
          <div className="p-12 text-center text-gray-400">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Fetching live projects from Firestore...
          </div>
        ) : activeProjects.length === 0 ? (
          <div className="bg-surface border border-white/5 rounded-3xl p-12 text-center">
            <Database size={32} className="mx-auto text-gray-600 mb-3" />
            <h3 className="font-heading text-lg font-semibold text-white mb-1">
              No {activeTab === 'dev' ? 'Dev' : '3D'} Projects Found
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Click the button below or seed the default data to display projects on your portfolio.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 rounded-xl bg-primary text-primary-fg text-xs font-medium flex items-center gap-1.5"
              >
                <Plus size={14} /> Add First Project
              </button>
              <button
                onClick={handleSeed}
                className="px-4 py-2 rounded-xl bg-surface-container border border-white/10 text-xs text-gray-300 font-medium flex items-center gap-1.5 hover:text-white"
              >
                <Database size={14} /> Seed Defaults
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeProjects.map((project) => {
              const isActive = project.isActive !== undefined ? Boolean(project.isActive) : true;
              return (
                <div
                  key={project.id}
                  className="bg-surface border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-white/20 transition-all"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative h-40 overflow-hidden bg-surface-container">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-gray-300">
                        Order: {project.order || 1}
                      </div>
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <span
                          className={`px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-semibold ${
                            isActive
                              ? 'bg-emerald-500/80 text-white border-emerald-400/40'
                              : 'bg-gray-800/80 text-gray-400 border-gray-600/40'
                          }`}
                        >
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-primary/80 backdrop-blur-md border border-primary/30 text-[10px] font-semibold text-white">
                          {project.status || 'In Development'}
                        </span>
                      </div>
                    </div>

                    {/* Body Details */}
                    <div className="p-5">
                      <h3 className="font-heading font-semibold text-white text-base mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-4">
                        {project.description}
                      </p>

                      {/* Display window / Schedule Info */}
                      <div className="mb-4 p-2.5 rounded-xl bg-surface-container border border-white/5 space-y-1 text-[11px] text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-primary" />
                          <span>Started: <strong className="text-gray-200">{project.startedOn || 'N/A'}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-secondary" />
                          <span>
                            Visible From: <strong className="text-gray-200">{project.showFrom || project.startedOn || 'N/A'}</strong> to{' '}
                            <strong className="text-gray-200">{project.showTo ? project.showTo : 'Forever'}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Tags */}
                      {Array.isArray(project.tags) && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-gray-400 flex items-center gap-1"
                            >
                              <Tag size={9} /> {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Links if available */}
                      <div className="flex items-center gap-3 text-[11px] text-gray-500">
                        {project.externalLink && (
                          <span className="flex items-center gap-1 text-primary">
                            <ExternalLink size={10} /> Link attached
                          </span>
                        )}
                        {project.privacyPolicyLink && (
                          <span className="flex items-center gap-1 text-gray-400">
                            <Shield size={10} /> Privacy policy
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer Action buttons */}
                  <div className="px-5 py-3 bg-surface-container border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleActive(project)}
                      className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                        isActive
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                      }`}
                      title={isActive ? 'Deactivate project' : 'Activate project'}
                    >
                      {isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                      <span className="text-[11px]">{isActive ? 'Active' : 'Hidden'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(project)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors"
                        title="Edit project details"
                      >
                        <Edit2 size={14} />
                        <span className="sr-only sm:not-sr-only">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-medium flex items-center gap-1 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 size={14} />
                        <span className="sr-only sm:not-sr-only">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface border border-white/10 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-heading text-lg font-semibold text-white">
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <ShieldAlert size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="p-3 bg-surface-container/80 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-white block">
                    Active Status
                  </label>
                  <p className="text-[11px] text-gray-400">
                    If inactive, project will not be shown on the public portfolio.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Project Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="dev">Software Dev Project</option>
                    <option value="3d">3D Printing Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Status Badge
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="In Development">In Development</option>
                    <option value="Publishing Soon">Publishing Soon</option>
                    <option value="Live">Live</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Schedule and Visibility Dates */}
              <div className="p-4 bg-surface-container rounded-2xl border border-white/10 space-y-3">
                <h4 className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
                  <Calendar size={14} className="text-primary" />
                  Schedule & Display Dates
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-300 mb-1">
                      Started On
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startedOn}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          startedOn: newDate,
                          showFrom: prev.showFrom === prev.startedOn ? newDate : prev.showFrom
                        }));
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-300 mb-1">
                      Show From Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.showFrom}
                      onChange={(e) => setFormData({ ...formData, showFrom: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-300 mb-1">
                      Show To Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.showTo}
                      onChange={(e) => setFormData({ ...formData, showTo: e.target.value })}
                      placeholder="Forever if blank"
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                    />
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      Leave blank to show forever
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. AI-Powered Expense Manager"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of what this project does and key tech stack..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-white/10 text-white text-xs focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="React, Kotlin, CAD, AI, FDM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Order #
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    External / Demo Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.externalLink}
                    onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                    placeholder="https://app.example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Privacy Policy Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.privacyPolicyLink}
                    onChange={(e) => setFormData({ ...formData, privacyPolicyLink: e.target.value })}
                    placeholder="/privacy-policy"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-white/10 text-white text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-white/10 text-gray-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  data-testid="admin-save-project-btn"
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-fg text-xs font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-primary-fg border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  {editingId ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
