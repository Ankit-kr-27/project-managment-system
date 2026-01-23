import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logout as apiLogout } from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const res = await getCurrentUser();
            setUser(res.data.data);
        } catch (err) {
            console.error("Failed to fetch user", err);
            localStorage.removeItem("accessToken");
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
        } catch (err) {
            console.error("Logout error", err);
        } finally {
            localStorage.removeItem("accessToken");
            setUser(null);
            window.location.href = "/login";
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading, fetchUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
