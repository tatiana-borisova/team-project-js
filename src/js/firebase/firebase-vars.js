import { getFirestore} from "firebase/firestore"
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
export const firebaseConsts = {
    fireStoreDatabase: getFirestore(),
    realTimeDatabase: getDatabase(),
    auth: getAuth(),
    userID: 0,
    databaseRef: {},
}

console.log(firebaseConsts.fireStoreDatabase);