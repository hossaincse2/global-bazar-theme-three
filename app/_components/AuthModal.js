'use client';

import useDictionary from '@/_hooks/useDictionary';
import useUser from '@/_hooks/useUser';
import { encrypt } from '@/_services/encryption';
import { getUserDetails, loginUser, registerUser } from '@/_utils/auth/getAuth';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AuthModal = ({ isOpen, onClose, initialType = 'signIn' }) => {
    const [authType, setAuthType] = useState(initialType);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { setUser } = useUser();
    const router = useRouter();
    const { dictionary } = useDictionary();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    const password = watch('password');

    const toggleAuthType = () => {
        setAuthType((prev) => (prev === 'signIn' ? 'signUp' : 'signIn'));
        reset();
    };

    const onSubmit = async (data) => {
        setLoading(true);
        
        if (authType === 'signUp') {
            const userData = {
                name: data.fullName,
                phone: data.phone,
                username: data.phone,
                email: data.email,
                password: data.password,
                password_confirmation: data.confirmPassword,
            };

            try {
                const response = await registerUser(JSON.stringify(userData));
                if (response.ok) {
                    const responseData = await response.json();
                    if (responseData.success) {
                        toast.success(responseData.message || 'Registration successful!');
                        setAuthType('signIn');
                        reset();
                        setValue('username', data.email);
                    } else {
                        toast.error(responseData.message || 'Registration failed');
                    }
                }
            } catch (error) {
                toast.error('Registration failed. Please try again.');
            }
        } else {
            const userData = {
                email_username: data.username,
                password: data.password,
                remember: data.remember,
            };

            try {
                const responseData = await loginUser(JSON.stringify(userData));
                const encryptedToken = encrypt(responseData.token);

                const userDetails = await getUserDetails(responseData.token);
                setUser(userDetails.data);

                Cookies.set('user', JSON.stringify(userDetails.data), {
                    expires: 3,
                    secure: true,
                    sameSite: 'Strict',
                });

                Cookies.set('userToken', encryptedToken, {
                    expires: 3,
                    secure: true,
                    sameSite: 'Strict',
                });

                toast.success(responseData.message || 'Login successful!');
                onClose();
                reset();
                router.push('/');
            } catch (error) {
                toast.error(error.message || 'Login failed. Please try again.');
            }
        }
        
        setLoading(false);
    };

    if (!isOpen) return null;

    const authTexts = dictionary?.Auth || {};

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="bg-white rounded-xl w-[90%] max-w-md mx-4 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {authType === 'signIn' ? (authTexts.signin || 'Sign In') : (authTexts.signup || 'Sign Up')}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                            <FiX className="text-xl" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {authType === 'signUp' && (
                            <>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        {authTexts.fullName || 'Full Name'}
                                    </label>
                                    <input
                                        type="text"
                                        {...register('fullName', { required: 'Full name is required', minLength: { value: 3, message: 'Min 3 characters' } })}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder={authTexts.namePlaceholder || 'Enter your name'}
                                    />
                                    {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>}
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        {authTexts.phone || 'Phone'}
                                    </label>
                                    <input
                                        type="tel"
                                        {...register('phone', { required: 'Phone is required' })}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder={authTexts.phonePlaceholder || 'Enter phone number'}
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        {authTexts.email || 'Email'}
                                    </label>
                                    <input
                                        type="email"
                                        {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } })}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder={authTexts.emailPlaceholder || 'Enter email'}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                                </div>
                            </>
                        )}

                        {authType === 'signIn' && (
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    {authTexts.email || 'Email'} {authTexts.orPhone || 'or Phone'}
                                </label>
                                <input
                                    type="text"
                                    {...register('username', { required: 'Email or phone is required' })}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder={authTexts.emailPlaceholder || 'Enter email or phone'}
                                />
                                {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>}
                            </div>
                        )}

                        <div className="relative">
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                {authTexts.password || 'Password'}
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', authType === 'signUp' ? { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } } : { required: 'Password is required' })}
                                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder={authTexts.passPlaceholder || 'Enter password'}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-500">
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                        </div>

                        {authType === 'signUp' && (
                            <div className="relative">
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    {authTexts.confPassword || 'Confirm Password'}
                                </label>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    {...register('confirmPassword', { required: 'Please confirm password', validate: (value) => value === password || 'Passwords do not match' })}
                                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder={authTexts.confPassPlaceholder || 'Confirm password'}
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-9 text-gray-500">
                                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
                            </div>
                        )}

                        {authType === 'signIn' && (
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" {...register('remember')} className="rounded border-gray-300" />
                                    <span className="text-sm text-gray-600">{authTexts.remember || 'Remember me'}</span>
                                </label>
                                <Link href="/forgot-password" className="text-sm text-primary-600 hover:underline">
                                    {authTexts.forgotPassword || 'Forgot password?'}
                                </Link>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition disabled:opacity-50"
                        >
                            {loading ? (dictionary?.Global?.loading || 'Please wait...') : (authType === 'signIn' ? (authTexts.signin || 'Sign In') : (authTexts.signup || 'Sign Up'))}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        {authType === 'signIn' ? (
                            <>
                                {authTexts.noAccount || "Don't have an account?"}{' '}
                                <button onClick={toggleAuthType} className="text-primary-600 font-medium hover:underline">
                                    {authTexts.signup || 'Sign Up'}
                                </button>
                            </>
                        ) : (
                            <>
                                {authTexts.haveAccount || 'Already have an account?'}{' '}
                                <button onClick={toggleAuthType} className="text-primary-600 font-medium hover:underline">
                                    {authTexts.signin || 'Sign In'}
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
