import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, verifyOtp } from '../../Redux/Slices/UserAuthSlice';
import { useNavigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function Register() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [otp, setOtp] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state) => state.userAuth);

    const handleRegister = async (e) => {
        e.preventDefault();
        const res = await dispatch(registerUser(formData));
        if (res?.payload?.success) {
            setStep(2);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const res = await dispatch(verifyOtp({ email: formData.email, otp }));
        if (res?.payload?.success) {
            navigate('/login');
        }
    };

    return (
        <div className="flex items-center justify-center py-8 sm:py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {step === 1 ? 'Create Account' : 'Verify Email'}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {step === 1 ? 'Join Royal Cakes' : `We sent an OTP to ${formData.email}`}
                    </p>
                </div>
                
                {step === 1 ? (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            fullWidth 
                            disabled={isLoading}
                            sx={{ bgcolor: '#be185d', '&:hover': { bgcolor: '#9d174d' }, py: 1.5 }}
                        >
                            {isLoading ? 'Sending OTP...' : 'Register'}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                            <input
                                type="text"
                                required
                                maxLength="6"
                                className="mt-1 block w-full px-3 py-2 text-center tracking-widest text-lg bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            fullWidth 
                            disabled={isLoading}
                            sx={{ bgcolor: '#be185d', '&:hover': { bgcolor: '#9d174d' }, py: 1.5 }}
                        >
                            {isLoading ? 'Verifying...' : 'Verify & Complete'}
                        </Button>
                    </form>
                )}

                {step === 1 && (
                    <p className="text-center text-sm text-gray-600">
                        Already have an account? <Link to="/login" className="text-pink-600 font-semibold hover:underline">Login</Link>
                    </p>
                )}
            </div>
        </div>
    );
}
