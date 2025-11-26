import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AuthLayout } from '../../layouts/AuthLayout';
import { InputField } from '../../components/ui/InputField';
import { Button } from '../../components/ui/Button';
import { login } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'admin@proedge.com' && password === 'password') {
      dispatch(login({ email, role: 'admin' }));
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to Proedge Learning Admin">
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
        <Button className="mt-2">Sign in</Button>
        <div className="text-center text-sm text-slate-500 mt-2">
          Need help? <button type="button" className="text-indigo-600 font-medium hover:underline">Contact Support</button>
        </div>
      </form>
    </AuthLayout>
  );
};
