import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { Lock, ShieldAlert, ArrowLeft, LogIn, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { auth } from '../../firebase';
import Logo from '../Logo';

/**
 * InvoiceAuthGate ensures /tools/invoice is strictly protected
 * and hidden from public search engines and unauthorized visitors.
 */
export default function InvoiceAuthGate({ children }) {
  const [user, setUser] = useState(null);
  const [localUser, setLocalUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('admin_session');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // Enforce noindex, nofollow on locked tool
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

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const activeUser = user || localUser;

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setSubmitting(true);

    const inputUser = username.trim();
    const inputPass = password.trim();

    if (!inputUser || !inputPass) {
      setAuthError('Please enter both email and password.');
      setSubmitting(false);
      return;
    }

    const expectedUsername = (process.env.ADMIN_USERNAME || '').trim();
    const expectedPassword = (process.env.ADMIN_PASSWORD || '').trim();

    if (!expectedUsername || !expectedPassword) {
      setAuthError('Admin credentials not configured in environment.');
      setSubmitting(false);
      return;
    }

    const isUserMatch =
      inputUser.toLowerCase() === expectedUsername.toLowerCase() ||
      (expectedUsername.indexOf('@') === -1 &&
        inputUser.toLowerCase() === `${expectedUsername.toLowerCase()}@zasdevlabs.com`);

    const isPassMatch = inputPass === expectedPassword;

    if (!isUserMatch || !isPassMatch) {
      setAuthError('Invalid credentials. Access restricted to ZasDevLabs administrator.');
      setSubmitting(false);
      return;
    }

    // Credentials match!
    const adminEmail = expectedUsername.includes('@')
      ? expectedUsername.toLowerCase()
      : `${expectedUsername.toLowerCase()}@zasdevlabs.com`;

    try {
      await signInWithEmailAndPassword(auth, adminEmail, expectedPassword);
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, adminEmail, expectedPassword);
        } catch (cErr) {
          console.warn('Firebase provision error, using local session:', cErr);
        }
      }
    }

    const adminSession = { email: adminEmail, uid: 'local-admin' };
    setLocalUser(adminSession);
    try {
      sessionStorage.setItem('admin_session', JSON.stringify(adminSession));
    } catch (e) {}

    setSubmitting(false);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-white font-body">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="mt-4 text-sm text-gray-400">Verifying secure administrative session...</p>
      </div>
    );
  }

  // If authenticated, render children directly
  if (activeUser) {
    return children;
  }

  // Not authenticated: render high-security login gate
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 text-white font-body relative overflow-hidden">
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full orb-blue blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full orb-green blur-3xl opacity-30 pointer-events-none" />

      <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-3 p-3 bg-surface-container rounded-2xl border border-white/10 shadow-md">
            <Logo size={44} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-2">
            <Lock size={12} />
            <span>Admin Restricted Area</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">Invoice Generator</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xs">
            Sign in with your ZasDevLabs administrator credentials to manage billing, clients, and dispatch invoices.
          </p>
        </div>

        {authError && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs sm:text-sm text-red-400 flex items-start gap-2.5">
            <ShieldAlert size={18} className="shrink-0 mt-0.5 text-red-400" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Admin Email / Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. skr@zasdevlabs.tech"
              autoComplete="username"
              className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full px-4 py-2.5 bg-surface-container border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 px-4 bg-primary text-primary-fg font-semibold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-opacity-90 active:scale-[0.99] transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {submitting ? (
              <div className="h-4 w-4 border-2 border-primary-fg border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={16} />
                <span>Unlock Invoice Workspace</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <Link
            to="/"
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Portfolio</span>
          </Link>

          <Link
            to="/admin"
            className="hover:text-primary transition-colors font-medium"
          >
            Go to Admin Dashboard &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
