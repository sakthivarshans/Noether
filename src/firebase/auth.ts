'use client';

import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { getOrCreateUser } from '@/firebase/users/service';
import { getFirestore } from 'firebase/firestore';

const provider = new GoogleAuthProvider();

export async function signInWithGoogle(auth: Auth) {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    if (user) {
      const firestore = getFirestore(auth.app);
      await getOrCreateUser(firestore, user);
    }
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    return null;
  }
}

export async function signOut(auth: Auth) {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }
}
