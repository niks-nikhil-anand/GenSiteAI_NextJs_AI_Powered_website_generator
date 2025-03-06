import {create} from 'zustand'

interface UserStore{
    userInput : string;
    setUserInput : (input: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    userInput: "",
    setUserInput: (input) => set({ userInput: input }),
}));