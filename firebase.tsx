// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { useState } from 'react';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAkOBQBRoY1Ml6su6xedMFK1kQLWRvLGLw',
  authDomain: 'tests-89f25.firebaseapp.com',
  projectId: 'tests-89f25',
  storageBucket: 'tests-89f25.appspot.com',
  messagingSenderId: '260604134151',
  appId: '1:260604134151:web:5cedfb398839a9e47bbba2',
  measurementId: 'G-5BP7KTP2QR',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const colRef = collection(db, 'Animes');
