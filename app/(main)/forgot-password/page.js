'use client';

import useDictionary from '@/_hooks/useDictionary';
import { postForgotPassword } from '@/_utils/auth/forgotPassword';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dictionary } = useDictionary();

    const forgotTexts = dictionary?.ForgotPassword || {};

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!email) {
            setEmailError(forgotTexts.emailRequired || 'Email is required');
            return;
        } else {
            setEmailError(null);
        }

        setIsLoading(true);

        try {
            const response = await postForgotPassword({ email });
            const responseData = await response.json();

            if (response.ok && responseData.success) {
                setEmail('');
                toast.success(`${responseData.status}`, {
                    position: 'bottom-right',
                });

                setSuccessMessage(forgotTexts.successMessage || 'Reset password link has been sent to your email.');

                setTimeout(() => {
                    setSuccessMessage(null);
                }, 5000);
            } else {
                let errorMessage = forgotTexts.failedMessage || 'Failed to send reset email. Please try again.';

                if (responseData.message) {
                    errorMessage = responseData.message;
                } else if (responseData.errors?.email?.[0]) {
                    errorMessage = responseData.errors.email[0];
                }

                setEmailError(errorMessage);

                setTimeout(() => {
                    setEmailError(null);
                }, 8000);

                toast.error(errorMessage, {
                    position: 'bottom-right',
                });
            }
        } catch (error) {
            console.error('Error submitting email:', error);
            const errorMessage = forgotTexts.networkError || 'Network error. Please check your connection and try again.';
            setEmailError(errorMessage);

            setTimeout(() => {
                setEmailError(null);
            }, 8000);

            toast.error(errorMessage, {
                position: 'bottom-right',
            });
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                    </div>
                    <h2 className="mb-2 text-3xl font-bold text-gray-900">
                        {forgotTexts.title || 'Forgot Password'}
                    </h2>
                    <p className="text-base text-gray-600">
                        {forgotTexts.description || 'Please provide your account email address to reset your password.'}
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

                    <form className="space-y-6" onSubmit={submitHandler}>
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                                {forgotTexts.emailLabel || 'Email Address'}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={forgotTexts.emailPlaceholder || 'yourmail@gmail.com'}
                                    className="w-full py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 transition-all duration-200 border border-gray-200 outline-none rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 focus:bg-white"
                                />
                            </div>
                            {emailError && (
                                <small className="block mt-1 text-sm text-red-500">
                                    {emailError}
                                </small>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                {forgotTexts.emailHint || 'We will send a password reset link to this email'}
                            </p>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="flex items-center justify-center">
                                    <span>{isLoading ? (dictionary?.Global?.loading || 'Loading...') : (forgotTexts.submit || 'Submit')}</span>
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
                                <span className="px-4 text-gray-500 bg-white">{forgotTexts.or || 'or'}</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link href="/" className="inline-flex items-center text-sm font-medium text-primary-600 transition-colors duration-200 hover:text-primary-500">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                </svg>
                                {forgotTexts.backToSignIn || 'Back to sign in'}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
