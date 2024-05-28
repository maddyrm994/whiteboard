import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyChzP7gB-mnjc9TxQ-Y3K5vYzkaiq-0fHk",
  authDomain: "collaborative-whiteboard-6405c.firebaseapp.com",
  databaseURL: "https://collaborative-whiteboard-6405c-default-rtdb.firebaseio.com/",
  projectId: "collaborative-whiteboard-6405c",
  storageBucket: "collaborative-whiteboard-6405c.appspot.com",
  messagingSenderId: "518542723076",
  appId: "1:518542723076:web:694683c9d8c69a90c8cd51"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);