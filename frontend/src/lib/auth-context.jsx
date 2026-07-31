import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { jwtDecode } from "jwt-decode";

import {
  loginUser,
  registerUser,
  googleLogin,
} from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("auth_token");

    if (token) {

      try {

        const decoded = jwtDecode(token);

        console.log("Stored JWT:", decoded);

        setUser(decoded);

      } catch {

        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");

      }

    }

    setIsLoading(false);

  }, []);

  const login = useCallback(async (credentials) => {

    const { data } = await loginUser(credentials);

    localStorage.setItem("auth_token", data.access_token);

    const decoded = jwtDecode(data.access_token);

    console.log("Login JWT:", decoded);

    localStorage.setItem(
      "auth_user",
      JSON.stringify(decoded)
    );

    setUser(decoded);

    return decoded;

  }, []);

  const loginWithGoogle = useCallback(async (credential) => {

  const { data } = await googleLogin(credential);

  localStorage.setItem(
    "auth_token",
    data.access_token
  );

  const decoded = jwtDecode(
    data.access_token
  );

  console.log(
    "Google JWT:",
    decoded
  );

  localStorage.setItem(
    "auth_user",
    JSON.stringify(decoded)
  );

  setUser(decoded);

  return decoded;

}, []);

  const register = useCallback(async (payload) => {

    const request = {
      full_name: payload.name,
      email: payload.email,
      password: payload.password,
    };

    const { data } = await registerUser(request);

    return data;

  }, []);

  const logout = useCallback(() => {

    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");

    setUser(null);

    window.location.href = "/login";

  }, []);

  return (

    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        role: user?.role,
        login,
        loginWithGoogle,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>

  );

}

export function useAuth() {

  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;

}