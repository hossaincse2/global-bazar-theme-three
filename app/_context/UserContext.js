'use client';

import { decrypt } from '@/_services/encryption';
import { getUserDetails, logOut } from '@/_utils/auth/getAuth';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';

const UserContext = createContext('');

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    const fetchUserData = async (token) => {
        try {
            const userData = await getUserDetails(decrypt(token));
            setUser(userData.data || userData);

            Cookies.set('user', JSON.stringify(userData.data || userData), {
                expires: 3,
                secure: true,
                sameSite: 'Strict',
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
            handleLogout();
        }
    };

    const handleLogout = async () => {
        try {
            const token = Cookies.get('userToken');
            if (token) {
                await logOut(decrypt(token));
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            setUser(null);
            Cookies.remove('user');
            Cookies.remove('userToken');
            router.push('/');
        }
    };

    useEffect(() => {
        const token = Cookies.get('userToken');
        const storedUser = Cookies.get('user');

        if (token) {
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch {
                    fetchUserData(token);
                }
            } else {
                fetchUserData(token);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, handleLogout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
