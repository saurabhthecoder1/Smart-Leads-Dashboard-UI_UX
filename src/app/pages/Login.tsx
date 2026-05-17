import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, Lock, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">SmartLeads</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mt-6">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<Lock className="w-4 h-4" />}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-foreground">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign in
            </Button>

            <div className="text-center">
              <span className="text-sm text-muted-foreground">Don't have an account? </span>
              <Link to="/register" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                Sign up
              </Link>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Demo Credentials:</p>
              <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                <div><strong>Admin:</strong> admin@smartleads.com / any password</div>
                <div><strong>Sales:</strong> sales@smartleads.com / any password</div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6">Manage your leads with ease</h2>
          <p className="text-lg text-indigo-100 mb-8">
            Track, qualify, and convert leads faster with our intelligent CRM platform.
            Get insights, automate workflows, and close more deals.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Smart Lead Tracking</h3>
                <p className="text-indigo-100 text-sm">Never miss a follow-up with automated reminders</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real-time Analytics</h3>
                <p className="text-indigo-100 text-sm">Make data-driven decisions with powerful insights</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Team Collaboration</h3>
                <p className="text-indigo-100 text-sm">Work together seamlessly with role-based access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
