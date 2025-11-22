'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Eye, EyeOff, User, Mail, Phone, Lock, Sparkles } from 'lucide-react';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create user profile in our users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: formData.email,
              full_name: formData.fullName,
              phone: formData.phone,
              role: 'student'
            }
          ]);

        if (profileError) throw profileError;

        // 3. Redirect to course selection
        router.push('/courses');
      }

    } catch (error: any) {
      setError(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* ANIMATED BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      {/* MAIN CARD */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl relative z-10 overflow-hidden">
        {/* Card background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0"></div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-20 animate-pulse"></div>
        
        <div className="relative z-10 p-8 space-y-6">
          {/* HEADER WITH SPARKLES */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-lg mb-2 relative">
              <Sparkles className="h-8 w-8 text-white animate-pulse" />
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur opacity-30 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Student Registration
              </h1>
              <p className="text-gray-300 mt-2 text-sm">
                Create your account to start learning
              </p>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}

          {/* SIGNUP FORM */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-white">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 backdrop-blur-sm transition-all"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 backdrop-blur-sm transition-all"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-white">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 backdrop-blur-sm transition-all"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 backdrop-blur-sm transition-all"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 backdrop-blur-sm transition-all"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* CREATE ACCOUNT BUTTON */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">
                {loading ? 'Creating Account...' : 'Create Student Account'}
              </span>
            </button>
          </form>

          {/* SIGN IN LINK */}
          <div className="text-center pt-4">
            <p className="text-gray-300 text-sm">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-orange-400 hover:text-orange-300 underline transition-colors">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}