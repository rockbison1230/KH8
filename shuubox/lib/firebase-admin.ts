import * as admin from 'firebase-admin';

// 1. Get the Project ID from the environment variables
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID; 

if (!admin.apps.length) {
  // 2. Initialize the app EXPLICITLY with the Project ID
  admin.initializeApp({
    projectId: PROJECT_ID,
  });
}

// 3. Force Emulator Connection in Development
if (process.env.NODE_ENV === 'development') {
    const FIRESTORE_EMULATOR_HOST = 'localhost:8080';
    
    // Set the settings to force the connection to the emulator
    admin.firestore().settings({
        host: FIRESTORE_EMULATOR_HOST,
        ssl: false,
    });
    console.log(`[Admin SDK] Connected to Firestore Emulator at ${FIRESTORE_EMULATOR_HOST}`);
}

const dbAdmin = admin.firestore();
export { dbAdmin };