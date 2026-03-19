import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { LogIn, UserPlus, Zap } from 'lucide-react';
import { AppContext } from '../App';

function Welcome() {
  const navigate = useNavigate();
  const { checkAuth } = useContext(AppContext);

  const handleGuestMode = () => {
    // Marcar que el usuario eligió modo invitado
    localStorage.setItem('planify_guest_mode', 'true');
    localStorage.setItem('planify_has_visited', 'true');
    
    // Recargar la página para aplicar cambios
    window.location.href = '#/';
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg-primary relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-accent-secondary/10" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-accent-gradient flex items-center justify-center shadow-card-lg">
            <Zap size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-accent-gradient bg-clip-text text-transparent mb-3">
            Planify
          </h1>
          <p className="text-text-tertiary text-lg">
            Your smart manager for subscriptions, tasks & passwords
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-bg-card border border-white/5 flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
            <p className="text-xs text-text-tertiary">Track Subscriptions</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-bg-card border border-white/5 flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
            <p className="text-xs text-text-tertiary">Plan Activities</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-bg-card border border-white/5 flex items-center justify-center">
              <span className="text-2xl">🔐</span>
            </div>
            <p className="text-xs text-text-tertiary">Secure Passwords</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Sign Up */}
          <button
            onClick={() => navigate('/register')}
            className="w-full inline-flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-base bg-accent-gradient text-white shadow-card-lg hover:shadow-card-md hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <UserPlus size={20} />
            Create Account
          </button>

          {/* Sign In */}
          <button
            onClick={() => navigate('/login')}
            className="w-full inline-flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-base bg-bg-card text-white border border-white/10 hover:bg-bg-tertiary hover:border-accent-primary/50 transition-all duration-200"
          >
            <LogIn size={20} />
            Sign In
          </button>

          {/* Guest Mode */}
          <button
            onClick={handleGuestMode}
            className="w-full py-3 px-6 rounded-xl font-medium text-sm text-text-tertiary hover:text-white hover:bg-bg-card transition-all duration-200"
          >
            Continue as Guest
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-xs text-text-tertiary">
            ☁️ Sign up to sync across devices
          </p>
          <p className="text-xs text-text-tertiary">
            📱 Guest mode works offline only
          </p>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
