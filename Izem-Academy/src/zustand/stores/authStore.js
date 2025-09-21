import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,     // will hold the full user object
      token: null,
      role: null,
      isValidated: null,

      // --- Authenticate (works for login & register) ---
      authenticate: (responseData) => {
        const { token, role, isValidated, ...userData } = responseData;

        set({
          isLoggedIn: true,
          user: userData,     // everything except token/role/isValidated
          token,
          role,
          isValidated,
        });
      },

      // --- Logout ---
      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
          token: null,
          role: null,
          isValidated: null,
        }),

      // --- Refresh token (placeholder) ---
      refreshTokenFn: async () => {
        try {
          const { token } = get();
          if (!token) return null;

          console.warn("⚠ refreshTokenFn not implemented yet");
          return null;
        } catch (error) {
          console.error("Failed to refresh token:", error);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage", // key in localStorage
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
