import { auth, provider } from "./firebase.conf";
import { signInWithPopup } from "firebase/auth";

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  return result;
};

export const signOut = async () => {
  return auth.signOut();
};
