
import { config } from '../config'
import firebase from "firebase/app";
import "firebase/storage";

firebase.initializeApp(config.firebaseConfig);
const storage = firebase.storage();

export {
  storage, firebase as default
}
