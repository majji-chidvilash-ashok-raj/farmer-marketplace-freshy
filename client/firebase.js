import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "freshy-685ce.firebaseapp.com",
  projectId: "freshy-685ce",
  storageBucket: "freshy-685ce.appspot.com",
  messagingSenderId: "400730295263",
  appId: "1:400730295263:web:a0af0149067b6d6cf8126a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };
