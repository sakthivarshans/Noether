'use client';

import {
  Auth,
  GoogleAuthProvider,
  getRedirectResult,
  signInWithRedirect,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { getOrCreateUser } from '@/firebase/users/service';
import { getFirestore } from 'firebase/firestore';

const provider = new GoogleAuthProvider();

export async function signInWithGoogle(auth: Auth) {
  // We will use signInWithRedirect instead of signInWithPopup
  // This is more robust against popup blockers.
  try {
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error('Error starting sign in with redirect:', error);
  }
}

/**
 * Handles the result of a sign-in redirect.
 * Should be called when the app loads to check if the user has just returned
 * from the Google sign-in page.
 * @param auth The Firebase Auth instance.
 */
export async function handleRedirectResult(auth: Auth) {
    try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
            const user = result.user;
            const firestore = getFirestore(auth.app);
            await getOrCreateUser(firestore, user);
            return user;
        }
    } catch (error) {
        console.error('Error handling redirect result:', error);
    }
    return null;
}


export async function signOut(auth: Auth) {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }
}
