
// Import functions from the SDKs
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js';

// Your web app's Firebase configuration
// Values are injected by GitHub Actions from your repository secrets
const firebaseConfig = {
  apiKey: AIzaSyA4aWa520xx0PrinfZ7RCTZL8GDf9U-DNM,
  authDomain: plahraga.firebaseapp.com,
  projectId: plahraga,
  storageBucket: plahraga.firebasestorage.app,
  messagingSenderId: 1012968248291,
  appId: 1:1012968248291:web:7939dc609052e4307ac6d6
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };

