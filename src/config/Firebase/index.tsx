import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-7aM0QtBHJbhJl6cqZZXxJG65l0kWO1Y",
    authDomain: "cozykost-4f305.firebaseapp.com",
    projectId: "cozykost-4f305",
    storageBucket: "cozykreact-native-vector-icons/Ioniconsreact-native-vector-icons/Ioniconsost-4f305.firebasestorage.app",
    messagingSenderId: "770469474304",
    appId: "1:770469474304:web:959dc93b0eb3fa3d8d68e5"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;

