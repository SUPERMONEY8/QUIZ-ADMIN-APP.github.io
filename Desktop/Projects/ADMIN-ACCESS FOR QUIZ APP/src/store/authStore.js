import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabase } from "../supabaseConfig";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      adminId: null,
      isAuthenticated: false,
      loading: true,
      error: null,

      // Initialize auth state from Supabase session
      initializeAuth: async () => {
        set({ loading: true, error: null });
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) {
            set({
              error: sessionError.message || "Failed to get session",
              loading: false,
            });
            return;
          }

          if (session?.user) {
            // Fetch admin ID from admins table
            const adminId = await get().fetchAdminId(session.user.id);
            
            set({
              user: {
                id: session.user.id,
                email: session.user.email,
                // Include other user properties if needed
                uid: session.user.id, // For backward compatibility
              },
              adminId: adminId,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
          } else {
            set({
              user: null,
              adminId: null,
              isAuthenticated: false,
              loading: false,
              error: null,
            });
          }
        } catch (err) {
          set({
            error: err.message || "Failed to initialize auth",
            loading: false,
          });
        }
      },

      // Fetch admin ID from admins table
      fetchAdminId: async (userId) => {
        try {
          const { data, error } = await supabase
            .from("admins")
            .select("id")
            .eq("id", userId)
            .single();

          if (error) {
            console.error("Error fetching admin ID:", error);
            return null;
          }

          return data?.id || null;
        } catch (err) {
          console.error("Error fetching admin ID:", err);
          return null;
        }
      },

      // Set user from Supabase user object or plain object
      setUser: async (userData) => {
        if (!userData) {
          set({
            user: null,
            adminId: null,
            isAuthenticated: false,
          });
          return;
        }

        // Handle both Supabase user object and plain objects
        const userId = userData.id || userData.uid;
        const userEmail = userData.email;

        // Validate user data - provide more detailed error message
        if (!userId) {
          console.warn("Invalid user data provided to setUser: missing id/uid", userData);
          return;
        }

        if (!userEmail) {
          console.warn("Invalid user data provided to setUser: missing email", userData);
          return;
        }

        try {
          // Fetch admin ID
          const adminId = await get().fetchAdminId(userId);

          set({
            user: {
              id: userId,
              email: userEmail,
              uid: userId, // For backward compatibility
            },
            adminId: adminId,
            isAuthenticated: true,
          });
        } catch (err) {
          console.error("Error setting user:", err);
          // Still set user even if admin ID fetch fails
          set({
            user: {
              id: userId,
              email: userEmail,
              uid: userId,
            },
            adminId: null,
            isAuthenticated: true,
          });
        }
      },

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      // Logout with Supabase
      logout: async () => {
        set({ loading: true, error: null });
        try {
          const { error: logoutError } = await supabase.auth.signOut();

          if (logoutError) {
            set({
              error: logoutError.message || "Logout failed",
              loading: false,
            });
            throw new Error(logoutError.message || "Logout failed");
          }

          set({
            user: null,
            adminId: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        } catch (err) {
          set({
            error: err.message || "Logout failed",
            loading: false,
          });
          throw err;
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        adminId: state.adminId,
        isAuthenticated: state.isAuthenticated,
      }),
      // Note: Auth is initialized on module load below
    }
  )
);

// Initialize auth state on module load (non-blocking)
if (typeof window !== 'undefined') {
  useAuthStore.getState().initializeAuth();

  // Listen for auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    const store = useAuthStore.getState();
    
    if (session?.user) {
      // Only set user if we have valid user data
      if (session.user.id && session.user.email) {
        await store.setUser(session.user);
      } else {
        console.warn("Auth state change: user data incomplete", session.user);
      }
    } else {
      store.setUser(null);
    }
  });
}

export default useAuthStore;


