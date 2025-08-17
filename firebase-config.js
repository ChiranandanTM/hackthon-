// Firebase configuration with your new API key
const firebaseConfig = {
  apiKey: "AIzaSyDsYin5vy1Dru7bYLeHoUUgVFqQ7G2Il8U",
  authDomain: "ambulance-31ef6.firebaseapp.com",
  projectId: "ambulance-31ef6",
  storageBucket: "ambulance-31ef6.appspot.com",
  messagingSenderId: "347504397142",
  appId: "1:347504397142:web:e657bb3622197fc4d864f7",
  databaseURL: "https://ambulance-31ef6.firebaseio.com" // Added for v8 compatibility
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Make the Google Maps API key available to other scripts
const googleMapsApiKey = firebaseConfig.apiKey;