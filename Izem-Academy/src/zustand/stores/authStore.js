import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set,get) => ({
      isLoggedIn: false,
      user: null,
      token: null,
      refreshToken: null,
      roles: [],

      // Fonction pour se connecter
      login: (responseData) =>
        set({
          isLoggedIn: true,
          user: {
            username: responseData.username,
            email: responseData.email,
          },
          token: responseData.jwt,
          refreshToken: responseData.refreshToken,
          roles: responseData.roles,
        }),

      // Fonction pour se déconnecter
      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
          token: null,
          refreshToken: null,
          roles: [],
        }),

      // Fonction pour rafraîchir le token
      refreshToken:async()=>{
        try{
          const { refreshToken } = get();
          if (!refreshToken) return null;

          const data = await refreshToken({ refreshToken });
          set({ token: data });
          return data

        }catch (error) {
          console.error('Failed to refresh token:', error);
          throw error;
        }
      }
    }),
    {
      name: "auth-storage", 
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
