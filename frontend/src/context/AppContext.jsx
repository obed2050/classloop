import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../services/authService.js';
import { normalizeUser } from '../utils/normalize.js';
import { getSocket, connectSocket, disconnectSocket } from '../services/socket.js';
import { currentUser as mockUser } from '../utils/mockData.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [socket, setSocket] = useState(null);

  // Try fetching current user on mount
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        const { data } = await getCurrentUser();
        if (!cancelled && data.success) {
          setUser(normalizeUser(data.data.user));
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    init();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await loginUser(credentials);
    if (data.success) {
      setUser(normalizeUser(data.data.user));
      return data.data.user;
    }
    throw new Error(data.message);
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await registerUser(formData);
    if (data.success) {
      setUser(normalizeUser(data.data.user));
      return data.data.user;
    }
    throw new Error(data.message);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // even if request fails, clear client state
    }
    setUser(null);
    disconnectSocket();
  }, []);

  // Connect socket when user is set
  useEffect(() => {
    if (user) {
      const sock = getSocket();
      sock.auth = { userId: user.id };
      connectSocket();
      setSocket(sock);
      return () => { disconnectSocket(); setSocket(null); };
    }
  }, [user]);

  const value = useMemo(() => ({
    user: user || mockUser,
    isAuthenticated: !!user,
    loading,
    searchQuery, setSearchQuery,
    login, register, logout,
    socket,
  }), [user, loading, searchQuery, login, register, logout, socket]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
