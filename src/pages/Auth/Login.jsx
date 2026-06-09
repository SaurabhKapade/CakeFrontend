import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../Redux/Slices/UserAuthSlice';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading } = useSelector((state) => state.userAuth);
    const from = location.state?.from || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return;

        const res = await dispatch(loginUser({ email, password }));
        if (res?.payload?.success) {
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="flex items-center justify-center py-8 sm:py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Log in to Royal Cakes</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        fullWidth 
                        disabled={isLoading}
                        sx={{ bgcolor: '#be185d', '&:hover': { bgcolor: '#9d174d' }, py: 1.5 }}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
                <p className="text-center text-sm text-gray-600">
                    Don't have an account? <Link to="/register" className="text-pink-600 font-semibold hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}
