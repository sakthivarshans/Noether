
'use client';

import {
  Auth,
  signOut as firebaseSignOut,
  signInAnonymously as firebaseSignInAnonymously,
} from 'firebase/auth';
import { getOrCreateUser } from '@/firebase/users/service';
import { getFirestore } from 'firebase/firestore';

export async function signInAnonymously(auth: Auth) {
  try {
    const result = await firebaseSignInAnonymously(auth);
    if (result && result.user) {
        const user = result.user;
        const firestore = getFirestore(auth.app);
        await getOrCreateUser(firestore, user);
        return user;
    }
  } catch (error) {
    console.error('Error signing in anonymously:', error);
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
