import { create } from 'zustand';
import type { IUser } from '../../lib/interfaces/auth';


type State = {
  authToken: string | null;
  currentUser: IUser | null;
  userEmail: string | null;
  isLoggedIn: boolean;
};

type Action = {
  updateCurrentUser: (user: IUser | null) => void;
  updateEmail: (email: string) => void;
  updateIsLoggedIn: (loginState: boolean) => void;
  updateAuthToken: (token: string) => void;
};

const useAuthStore = create<State & Action>((set) => ({
  authToken: null,
  currentUser: null,
  userEmail: null,
  isLoggedIn: false,
  updateCurrentUser: (user: IUser | null) => set({ currentUser: user }),
  updateEmail: (email: string) => set({ userEmail: email }),
  updateIsLoggedIn: (loginState: boolean) => set({ isLoggedIn: loginState }),
  updateAuthToken: (token: string) => set({ authToken: token })
}));

export default useAuthStore;
