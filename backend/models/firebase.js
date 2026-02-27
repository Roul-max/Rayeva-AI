import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

let db; // Will hold Firestore instance (real or mock)

try {
  // If FIREBASE_CONFIG is available, initialize real Firebase Admin
  if (process.env.FIREBASE_CONFIG) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    db = admin.firestore();
    console.log("Firebase initialized successfully");

  } else {
    // If no credentials are provided, fall back to a simple mock (for dev/testing)
    console.warn(
      "FIREBASE_CONFIG not found. Using mock Firestore for development."
    );

    db = {
      collection: (colName) => ({
        add: async (data) => {
          console.log(`[Mock Firestore] Added to ${colName}:`, data);
          return { id: `mock-id-${Date.now()}` };
        },

        doc: (id) => ({
          set: async (data) => {
            console.log(`[Mock Firestore] Set ${colName}/${id}:`, data);
            return { id };
          },

          get: async () => ({
            exists: true,
            data: () => ({ id, ...data }),
          }),
        }),

        get: async () => ({
          docs: [],
        }),
      }),
    };
  }

} catch (err) {
  console.error("Error while initializing Firebase:", err);
  process.exit(1); // Stop the app if Firebase fails to initialize
}

export { db };