import { useState, useCallback } from "react";
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

// Custom useAuth for admin-access - always returns a user (no login required)
export default function useAuth() {
  const [user, setUser] = useState({
    id: 'admin-access-direct',
    email: 'admin@admin.com',
    uid: 'admin-access-direct'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = useCallback(async (email, password) => {
    // Not needed for admin-access, but provide for compatibility
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential?.user) {
        setUser({
          id: userCredential.user.uid,
          email: userCredential.user.email,
          uid: userCredential.user.uid
        });
      }
      return userCredential;
    } catch (err) {
      throw err;
    }
  }, []);

  const signup = useCallback(async (email, password, isAdmin = false) => {
    // Not needed for admin-access, but provide for compatibility
    throw new Error("Signup not available in admin-access mode");
  }, []);

  const logout = useCallback(async () => {
    // Not needed for admin-access, but provide for compatibility
    try {
      await firebaseSignOut(auth);
      // Reset to mock user
      setUser({
        id: 'admin-access-direct',
        email: 'admin@admin.com',
        uid: 'admin-access-direct'
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
  }, []);

  return { user, loading, login, signup, logout, error };
}
