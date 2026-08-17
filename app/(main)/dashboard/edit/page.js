'use client';

import useDictionary from '@/_hooks/useDictionary';
import useUser from '@/_hooks/useUser';
import { decrypt } from '@/_services/encryption';
import { updateUser } from '@/_utils/auth/getAuth';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function EditProfilePage() {
    const { user, setUser } = useUser();
    const router = useRouter();
    const { dictionary } = useDictionary();
    const authTexts = dictionary?.Auth || {};
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        address: '',
        currentPassword: '',
        newPassword: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                dob: user.dob || '',
                address: user.address || '',
                currentPassword: '',
                newPassword: '',
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (formData.currentPassword && formData.currentPassword.length < 8) {
            newErrors.currentPassword = 'Password must be at least 8 characters';
        }
        if (formData.currentPassword && !formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        }
        if (formData.newPassword && formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setLoading(true);
        const token = Cookies.get('userToken');

        const updatedData = {
            name: formData.name,
            dob: formData.dob,
            address: formData.address,
            ...(formData.currentPassword && { currentPassword: formData.currentPassword }),
            ...(formData.newPassword && { newPassword: formData.newPassword }),
        };

        try {
            const response = await updateUser(JSON.stringify(updatedData), decrypt(token));
            const updatedUser = { ...user, ...response.data };
            setUser(updatedUser);

            const existingCookie = Cookies.get('user');
            if (existingCookie) {
                const parsedCookie = JSON.parse(existingCookie);
                Cookies.set('user', JSON.stringify({ ...parsedCookie, ...response.data }), {
                    expires: 3,
                    secure: true,
                    sameSite: 'Strict'
                });
            }

            toast.success('Profile updated successfully!');
            router.push(`/dashboard/user/${updatedUser?.username}`);
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 pb-4 border-b border-gray-200 mb-8">
                {authTexts.editProfile || 'Edit Profile'}
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{authTexts.fullName || 'Full Name'}</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{authTexts.email || 'Email'}</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{authTexts.phone || 'Phone'}</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            readOnly
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{authTexts.dob || 'Date of Birth'}</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{authTexts.currentPass || 'Current Password'}</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            placeholder="Leave blank to keep current"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.currentPassword && <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{authTexts.newPass || 'New Password'}</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            placeholder="Leave blank to keep current"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.newPassword && <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">{authTexts.address || 'Address'}</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="mt-8 flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : (authTexts.save || 'Save Changes')}
                    </button>
                    <Link
                        href={`/dashboard/user/${user?.username}`}
                        className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
                    >
                        {authTexts.cancel || 'Cancel'}
                    </Link>
                </div>
            </form>
        </div>
    );
}
