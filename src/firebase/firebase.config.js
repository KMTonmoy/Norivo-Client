import { initializeApp } from 'firebase/app';


const firebaseConfig = {
  apiKey: "AIzaSyD6UMhNjj_fN9VzU45WP6kavxWwtmZNBfw",
  authDomain: "norivo.firebaseapp.com",
  projectId: "norivo",
  storageBucket: "norivo.firebasestorage.app",
  messagingSenderId: "901131023253",
  appId: "1:901131023253:web:c93275038b94f44462fc9c"
};

export const app = initializeApp(firebaseConfig);