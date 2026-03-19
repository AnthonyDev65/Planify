import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { supabaseAuth } from '../services/supabase';
import Toast from '../components/Toast';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setToast({ visible: true, message: 'Please fill all fields', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      await supabaseAuth.signIn(formData.email, formData.password);
      localStorage.setItem('planify_has_visited', 'true');
      localStorage.removeItem('planify_guest_mode');
      setToast({ visible: true, message: 'Welcome back!', type: 'success' });
      
      // Esperar un momento y recargar
      setTimeout(() => {
        window.location.href = '#/';
        window.location.reload();
      }, 1000);
    } catch (error) {
      setToast({ visible: true, message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('planify_guest_mode', 'true');
    localStorage.setItem('planify_has_visited', 'true');
    window.location.href = '#/';
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg-primary">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-accent-gradient bg-clip-text text-transparent mb-2">
            Planify
          </h1>
          <p className="text-text-tertiary">Sign in to sync your data</p>
        </div>

        {/* Form */}
        <div className="bg-bg-card rounded-2xl p-6 border border-white/5">
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label className="text-sm font-medium text-white/80 flex items-center gap-2 mb-2">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                name="email"
                className="input"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="text-sm font-medium text-white/80 flex items-center gap-2 mb-2">
                <Lock size={16} />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="input pr-12"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm bg-accent-gradient text-white shadow-card hover:shadow-card-md hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-text-tertiary">OR</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="w-full py-3 px-4 rounded-xl font-medium text-sm bg-bg-tertiary text-text-secondary hover:bg-bg-hover hover:text-white transition-all duration-200"
          >
            Continue without account
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-text-tertiary mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent-primary hover:text-accent-secondary font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-xs text-text-tertiary">
          <p>🔒 Your data is encrypted and secure</p>
          <p className="mt-1">☁️ Sync across all your devices</p>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}

export default Login;
