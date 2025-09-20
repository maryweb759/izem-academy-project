import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,     // will hold the whole response object
      token: null,
      role: null,     // single string role
      isValidated: null,

      // --- Login ---
      login: (responseData) =>
        set({
          isLoggedIn: true,
          user: responseData,          // keep the full response for UI/admin
          token: responseData.token,   // backend sends "token"
          role: responseData.role,     // backend sends single string role
          isValidated: responseData.isValidated,
        }),

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
      // ❗ Your backend doesn’t return a refreshToken in login response
      // If you implement refresh API later, update this function.
      refreshTokenFn: async () => {
        try {
          const { token } = get();
          if (!token) return null;

          // Example: call backend refresh endpoint
          // const { data } = await api.post("/users/refresh", { token });
          // set({ token: data.newToken });
          // return data.newToken;

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
