import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { loginUser, registerUser, fetchProfile, updateProfileApi, changePasswordApi } from '../services/authService.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(false);
  const isAuthenticated = !!user && !!token;

  // Fetch profile if token exists on mount
  useEffect(() => {
    const init = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const data = await fetchProfile();
        setUser(data.user);
      } catch (err) {
        // token invalid / expired
        handleLogout(false);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [token]);

  function storeToken(t) {
    setToken(t);
    if (t) localStorage.setItem('authToken', t); else localStorage.removeItem('authToken');
  }

  async function handleLogin(credentials) {
    setLoading(true);
    try {
      const data = await loginUser(credentials);
      storeToken(data.token);
      setUser(data.user);
      toast.success('Logged in');
      return true;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(form) {
    setLoading(true);
    try {
      const data = await registerUser(form);
      storeToken(data.token);
      setUser(data.user);
      toast.success('Account created');
      return true;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleProfileUpdate(form) {
    setLoading(true);
    try {
      const data = await updateProfileApi(form);
      setUser(data.user);
      toast.success('Profile updated');
      return true;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(form) {
    setLoading(true);
    try {
      await changePasswordApi(form);
      toast.success('Password changed');
      return true;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  }

  function handleLogout(showToast = true) {
    storeToken(null);
    setUser(null);
    if (showToast) toast.success('Logged out');
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleProfileUpdate,
    changePassword: handleChangePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
