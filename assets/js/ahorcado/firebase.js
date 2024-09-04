// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtx64LVIfVTDgXdF_RnFVuPddSYTxuxRc",
  authDomain: "break-games-b84b1.firebaseapp.com",
  databaseURL: "https://break-games-b84b1-default-rtdb.firebaseio.com",
  projectId: "break-games-b84b1",
  storageBucket: "break-games-b84b1.appspot.com",
  messagingSenderId: "285715405416",
  appId: "1:285715405416:web:1d59438f61f24a73ccf9dd",
  measurementId: "G-MKD520HLEY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, get };
