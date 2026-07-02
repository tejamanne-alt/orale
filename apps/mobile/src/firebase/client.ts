import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { Functions, getFunctions } from "firebase/functions";
import { env } from "../config/env";

let app: FirebaseApp | undefined;
let firestore: Firestore | undefined;
let functions: Functions | undefined;
let auth: Auth | undefined;

function getApp(): FirebaseApp {
  if (!env.firebase.projectId) {
    throw new Error(
      "Firebase is not configured. Set EXPO_PUBLIC_FIREBASE_* env vars, or run with " +
        "EXPO_PUBLIC_DATA_BACKEND=mock (the default) to use the local mock backend instead.",
    );
  }
  if (!app) {
    app = getApps()[0] ?? initializeApp(env.firebase);
  }
  return app;
}

export function getFirestoreClient(): Firestore {
  if (!firestore) {
    firestore = getFirestore(getApp());
  }
  return firestore;
}

export function getFunctionsClient(): Functions {
  if (!functions) {
    functions = getFunctions(getApp());
  }
  return functions;
}

export function getAuthClient(): Auth {
  if (!auth) {
    // NOTE: plain getAuth() does not persist sessions across app restarts on
    // React Native. Once real auth ships, switch to initializeAuth() with
    // getReactNativePersistence(AsyncStorage) from firebase/auth/react-native.
    auth = getAuth(getApp());
  }
  return auth;
}
