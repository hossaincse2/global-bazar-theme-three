"use client"

import { useState } from "react";
import { AuthContext } from "@/_context/AuthConext";

export const AuthProvider = ({ children }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [authToken, setAuthToken] = useState(null);

    return (
        <AuthContext.Provider value={{ authToken, setAuthToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
