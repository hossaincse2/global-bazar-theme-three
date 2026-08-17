'use client';

import useDictionary from '@/_hooks/useDictionary';
import useUser from '@/_hooks/useUser';
import { decrypt } from '@/_services/encryption';
import { updateUserProfilePicture } from '@/_utils/auth/getAuth';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FiEdit3, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function UserProfilePage() {
    const { user, setUser } = useUser();
    const { dictionary } = useDictionary();
    const authTexts = dictionary?.Auth || {};
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            setUploading(true);
            const token = Cookies.get('userToken');
            if (!token) {
                toast.error('Please login again');
                return;
            }

            const response = await updateUserProfilePicture(formData, decrypt(token));

            if (response && response.data) {
                const updatedUser = { ...user, avatar: response.data };
                setUser(updatedUser);

                const existingCookie = Cookies.get('user');
                if (existingCookie) {
                    const parsedCookie = JSON.parse(existingCookie);
                    Cookies.set('user', JSON.stringify({ ...parsedCookie, avatar: response.data }), {
                        expires: 3,
                        secure: true,
                        sameSite: 'Strict'
                    });
                }

                toast.success('Profile picture updated!');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update profile picture');
        } finally {
            setUploading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 pb-4 border-b border-gray-200 mb-8">
                {authTexts.accountDetails || 'Account Details'}
            </h2>

            {/* Profile Photo */}
            <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{authTexts.profilePhoto || 'Profile Photo'}</h3>
                <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-100">
                        {user.avatar ? (
                            <Image src={user.avatar} alt={user.name} width={96} height={96} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                                <FiUser className="text-4xl text-primary-600" />
                            </div>
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center cursor-pointer transition">
                        <FiEdit3 className="text-sm" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
                    </label>
                </div>
            </div>

            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">{authTexts.fullName || 'Full Name'}</h4>
                    <p className="text-lg text-gray-900">{user.name || 'N/A'}</p>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">{authTexts.email || 'Email'}</h4>
                    <p className="text-lg text-gray-900">{user.email || 'N/A'}</p>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">{authTexts.phone || 'Phone'}</h4>
                    <p className="text-lg text-gray-900">{user.phone || 'N/A'}</p>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">{authTexts.dob || 'Date of Birth'}</h4>
                    <p className="text-lg text-gray-900">{user.dob || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">{authTexts.address || 'Address'}</h4>
                    <p className="text-lg text-gray-900">{user.address || 'N/A'}</p>
                </div>
            </div>

            <div className="mt-8">
                <Link href="/dashboard/edit" className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition">
                    {authTexts.editProfile || 'Edit Profile'}
                </Link>
            </div>
        </div>
    );
}
