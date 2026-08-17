import { AuthContext } from '@/_context/AuthConext';
import { useContext } from 'react';

const useAuth = () => {
    const { authToken, setAuthToken } = useContext(AuthContext);
    return { authToken, setAuthToken };
};

export default useAuth;
