'use client';

import useDictionary from '@/_hooks/useDictionary';
import { postResetPassword } from '@/_utils/auth/forgotPassword';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const PasswordReset = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { dictionary } = useDictionary();

    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const resetTexts = dictionary?.ResetPassword || {};

    useEffect(() => {
        const tokenParam = params.token;
        const emailParam = searchParams.get('email');

        if (tokenParam) setToken(tokenParam);
        if (emailParam) setEmail(emailParam);
    }, [params, searchParams]);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const password = watch('password');

    const onSubmit = async (data) => {
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const response = await postResetPassword({
                token,
                email,
                password: data.password,
                password_confirmation: data.password_confirmation,
            });

            const responseData = await response.json();

            if (response.ok && responseData.success) {
                reset();

                setSuccessMessage(resetTexts.successMessage || 'Password reset successfully! Redirecting to login...');

                setTimeout(() => {
                    setSuccessMessage(null);
                    router.push('/');
                }, 3000);
            } else {
                let errMsg = resetTexts.failedMessage || 'Failed to reset password. Please try again.';

                if (!responseData.message) {
                    errMsg = responseData.message;
                } else if (responseData.errors) {
                    if (responseData.errors.password?.[0]) {
                        errMsg = responseData.errors.password[0];
                    } else if (responseData.errors.token?.[0]) {
                        errMsg = responseData.errors.token[0];
                    } else if (responseData.errors.email?.[0]) {
                        errMsg = responseData.errors.email[0];
                    }
                }

                setErrorMessage(errMsg);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 8000);

                toast.error(errMsg, {
                    position: 'bottom-right',
                });
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            const errMsg = resetTexts.networkError || 'Network error. Please check your connection and try again.';
            setErrorMessage(errMsg);

            setTimeout(() => {
                setErrorMessage(null);
            }, 8000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full shadow-lg bg-primary-600">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                        </svg>
                    </div>
                    <h2 className="mb-2 text-3xl font-bold text-gray-900">
                        {resetTexts.title || 'Reset Password'}
                    </h2>
                    <p className="text-base text-gray-600">
                        {resetTexts.description || 'Enter your new password below.'}
                    </p>
                </div>

                <div className="p-8 bg-white border shadow-xl rounded-2xl border-gray-100">
                    {successMessage && (
                        <div className="px-4 py-3 mb-6 text-green-700 bg-green-100 border border-green-300 rounded-xl">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                {successMessage}
                            </div>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="px-4 py-3 mb-6 text-red-700 bg-red-100 border border-red-300 rounded-xl">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                {errorMessage}
                            </div>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                {resetTexts.newPassword || 'New Password'}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder={resetTexts.newPasswordPlaceholder || 'Enter new password'}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 outline-none ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                                    {...register('password', {
                                        required: resetTexts.passwordRequired || 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message: resetTexts.passwordMinLength || 'Password must be at least 8 characters',
                                        },
                                    })}
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                {resetTexts.passwordHint || 'Password must be at least 8 characters'}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-700">
                                {resetTexts.confirmPassword || 'Confirm New Password'}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    id="password_confirmation"
                                    placeholder={resetTexts.confirmPasswordPlaceholder || 'Confirm new password'}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500 outline-none ${errors.password_confirmation ? 'border-red-500' : 'border-gray-200'}`}
                                    {...register('password_confirmation', {
                                        required: resetTexts.confirmRequired || 'Please confirm your password',
                                        validate: (value) => value === password || (resetTexts.passwordMismatch || 'Passwords do not match'),
                                    })}
                                />
                            </div>
                            {errors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-500">{errors.password_confirmation.message}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                {resetTexts.confirmHint || 'Re-enter your password to confirm'}
                            </p>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="flex items-center justify-center">
                                    <span>{isLoading ? (resetTexts.resetting || 'Resetting...') : (resetTexts.submit || 'Reset Password')}</span>
                                    {isLoading && (
                                        <svg className="w-4 h-4 ml-2 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                </span>
                            </button>
                        </div>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 text-gray-500 bg-white">{resetTexts.or || 'or'}</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link href="/" className="inline-flex items-center text-sm font-medium text-primary-600 transition-colors duration-200 hover:text-primary-500">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                </svg>
                                {resetTexts.backToSignIn || 'Back to sign in'}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;
