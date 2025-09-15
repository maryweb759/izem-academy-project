import {create} from 'zustand';

// Création du store global pour gérer les erreurs
const useErrorStore = create((set) => ({
  errorMessage: "لقد حدث خطأ, من فضلك حاول الاتصال لاحقا", 
  setError: (message) => set({ errorMessage: message }),
  clearError: () => set({ errorMessage: "" }), 
}));

export default useErrorStore; 