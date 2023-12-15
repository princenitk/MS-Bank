import {db} from "../firebase";

import { 
    collection,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc, 
    doc 
} from "firebase/firestore";


const userCollectionRef = collection(db, "users");

class UserDataService{

    addUsers = (newUser) => {
        return addDoc(userCollectionRef, newUser);
    }

    updateUser = (id, updatedUser) => {
        const userDoc = doc(db, "users", id);
        return updateDoc(userDoc, updatedUser);
    }

    deleteUser = (id) => {
        const userDoc = doc(db,"users",id);
        return deleteDoc(userDoc);
    }

    getUser = (id) => {
        const userDoc = doc(db,"users",id);
        return getDoc(userDoc);
    }

}

export default new UserDataService();