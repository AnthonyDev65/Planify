import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { supabaseAuth } from '../services/supabase';
import Toast from '../components/Toast';

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setToast({ visible: true, message: 'Please fill all fields', type: 'error' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setToast({ visible: true, message: 'Passwords do not match', type: 'error' });
      return;
    }

    if (formData.password.length < 6) {
      setToast({ visible: true, message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      await supabaseAuth.signUp(formData.email, formData.password);
      localStorage.setItem('planify_has_visited', 'true');
      localStorage.removeItem('planify_guest_mode');
      setToast({ visible: true, message: 'Account created! Check your email to verify.', type: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setToast({ visible: true, message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg-primary">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-accent-gradient bg-clip-text text-transparent mb-2">
            Planify
          </h1>
          <p className="text-text-tertiary">Create your account</p>
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
            <div className="mb-4">
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
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="text-sm font-medium text-white/80 flex items-center gap-2 mb-2">
                <Lock size={16} />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="input pr-12"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Sign Up
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-text-tertiary mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-primary hover:text-accent-secondary font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-xs text-text-tertiary">
          <p>🔒 Your data is encrypted and secure</p>
          <p className="mt-1">☁️ Sync across all your devices</p>
          <p className="mt-1">📱 Works offline too</p>
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

export default Register;
