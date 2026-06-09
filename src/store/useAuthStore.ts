import { create } from "zustand";
import apiClient from "../services/apiClient";


interface DoctorDetails {
    specialization: string;
    working_hours_start: string;
    working_hours_end: string;
}

interface User {
    user_id: number;
    email: string;
    role: "patient" | "doctor";
    first_name: string;
    last_name: string;
    doctor_details: DoctorDetails | null
}

interface AuthStore {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
}


export const useAuthStore = create<AuthStore>((set, get) => ({
    //Initialize State values
    user: null,
    isLoading: false,
    error: null,

    checkSession: async () => {
        set({isLoading: true, error: null})
        try {
            const res = await apiClient.get("/api/auth/me");
            set({user: res.data});
        } catch (err: any) {
            set({user: null});
        } finally {
            set({isLoading: false});
        }
        
    },

    login: async (email, password) => {
        set({isLoading: true, error: null})
        try {
            await apiClient.post("/api/auth/login", {email, password})
            await get().checkSession()
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || "An unexpected error occured. Please try again."
           set({error : errorMessage})
        } finally {
            set({isLoading: false})
        }   
    },

    logout: async () => {
        set({isLoading: true, error: null})
        try {
            await apiClient.post("/api/auth/logout") 
            set({user: null})
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || "An unexpected error occured. Please try again."
           set({error : errorMessage})
           set({user: null})
        } finally {
            set({isLoading: false})
        }
    },
}))
