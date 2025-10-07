'use client';

import {
  doc,
  getDoc,
  setDoc,
  Firestore,
  serverTimestamp,
} from 'firebase/firestore';
import { User } from 'firebase/auth';

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
 * @returns The user's profile data from Firestore.
 */
export async function getOrCreateUser(
  firestore: Firestore,
  user: User
): Promise<UserProfile> {
  const userRef = doc(firestore, 'users', user.uid);
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

    // Use setDoc to create the new user profile document.
    // We don't use the non-blocking version here because we want to ensure
    // the profile is created before any subsequent logic might need it.
    await setDoc(userRef, newUserProfile);

    return newUserProfile;
  }
}
