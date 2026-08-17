'use client';

import { useContext } from 'react';
import UserContext from '../_context/UserContext';

const useUser = () => {
    const { user, setUser, handleLogout } = useContext(UserContext);
    return { user, setUser, handleLogout };
};

export default useUser;
