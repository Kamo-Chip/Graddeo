import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const addItemToCollection = async (item, collectionToAdd, id) => {
    await setDoc(doc(db, collectionToAdd, id), item);
};

export { addItemToCollection};