import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCiyoi_G1qZ-GytHyW1bteatU8nON5Pvw4",
  authDomain: "discord-clone-5b087.firebaseapp.com",
  projectId: "discord-clone-5b087",
  storageBucket: "discord-clone-5b087.appspot.com",
  messagingSenderId: "193834427921",
  appId: "1:193834427921:web:4a56f34fd58da3ddbff3b0",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
