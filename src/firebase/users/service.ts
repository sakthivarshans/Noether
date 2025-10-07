'use client';

import {
  doc,
  getDoc,
  setDoc,
  Firestore,
  serverTimestamp,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// Define the shape of our user profile data
interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  profileImageURL: string | null;
  createdAt: any; // Use 'any' for serverTimestamp
}

/**
 * Checks if a user profile exists in Firestore, and if not, creates one.
 * This function is designed to be called after a user signs in.
 *
 * @param firestore The Firestore database instance.
 * @param user The Firebase Auth User object.
 * @returns The user's profile data from Firestore or null if an error occurs.
 */
export async function getOrCreateUser(
  firestore: Firestore,
  user: User
): Promise<UserProfile | null> {
  const userRef = doc(firestore, 'users', user.uid);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // User profile already exists, return the data.
      return userSnap.data() as UserProfile;
    } else {
      // User profile doesn't exist, create it.
      const newUserProfile: UserProfile = {
        id: user.uid,
        email: user.email,
        name: user.displayName,
        profileImageURL: user.photoURL,
        createdAt: serverTimestamp(), // Let Firestore set the creation time
      };

      // We use await here, but catch the specific permission error.
      await setDoc(userRef, newUserProfile);

      return newUserProfile;
    }
  } catch (error: any) {
    // Determine the operation type based on which part of the 'try' block failed.
    // This is a simplification; a more robust way would be to check if the doc existed before trying to set.
    // For now, we'll assume a 'get' or 'create' failed.
    const operation =
      error.code === 'permission-denied' && error.message.includes('create')
        ? 'create'
        : 'get';

    const permissionError = new FirestorePermissionError({
      path: userRef.path,
      operation: operation,
      ...(operation === 'create' && { requestResourceData: {
        id: user.uid,
        email: user.email,
        name: user.displayName,
        profileImageURL: user.photoURL,
        // We can't send serverTimestamp() to the error object.
      }}),
    });

    errorEmitter.emit('permission-error', permissionError);

    // Return null or re-throw a generic error to signal failure to the caller.
    return null;
  }
}