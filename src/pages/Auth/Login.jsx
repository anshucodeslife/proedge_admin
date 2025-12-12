import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AuthLayout } from '../../layouts/AuthLayout';
import { InputField } from '../../components/ui/InputField';
import { Button } from '../../components/ui/Button';
import { loginUser } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('admin@proedge.com');
  const [password, setPassword] = useState('admin123');
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    dispatch(loginUser({ email, password })).then((result) => {
      if (result.type === 'auth/login/fulfilled') {
        navigate('/');
      }
    });
  };

  return (
    // <AuthLayout title="Welcome back" subtitle="Sign in to Proedge Learning Admin">
    <AuthLayout subtitle="Sign in to Proedge Learning Admin">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <InputField
          id="email"
          type="email"
          label="Email address"
          placeholder="admin@proedge.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          id="password"
          type="password"
          label="Password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className="mt-2 w-full" variant="success" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
        <div className="text-center text-sm text-slate-500 mt-6">
          <a href="https://www.proedgelearning.in/" className="text-slate-400 hover:text-slate-600 transition-colors">← Return to Home</a>
        </div>
      </form>
    </AuthLayout>
  );
};
