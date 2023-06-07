/*global uuidv4 firebase Avatar THREE Vue settings Terrain shuffleArray getRandom */

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM4gVJgeJyHGTxtwO4kYRDm-mcRYZbbl4",
  authDomain: "playground-d1789.firebaseapp.com",
  databaseURL: "https://playground-d1789-default-rtdb.firebaseio.com",
  projectId: "playground-d1789",
  storageBucket: "playground-d1789.appspot.com",
  messagingSenderId: "250400190977",
  appId: "1:250400190977:web:c76886e3de9114e381c600",
  measurementId: "G-35TZFE57LH"
};

//=========================================================================
// AVATAR UTILITIES

//=========================================================================
// IO stuff

let IO = {
  db: undefined,
  avatarMaxCount: 9,
};

try {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log("FIREBASE INIT!");

  // Create the database
  IO.db = firebase.database();
} catch (err) {
  console.warn("Can't connect to firebase");
}

