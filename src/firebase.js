// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase, ref, set } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCHxn1khBcymcH01prxtPh1zMFCzsdIjOQ',
  authDomain: 'bruch-chat-app.firebaseapp.com',
  databaseURL:
    'https://bruch-chat-app-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'bruch-chat-app',
  storageBucket: 'bruch-chat-app.appspot.com',
  messagingSenderId: '273949212893',
  appId: '1:273949212893:web:fc1e66330dd6fc954d5b34',
  measurementId: 'G-8Q2PZ2RJZD',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
