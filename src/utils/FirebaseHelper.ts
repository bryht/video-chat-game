import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";
import { User } from "common/Models/User";
import Log from "./Log";
import Guid from "./Guid";

export default class FirebaseHelper {

    static database: firebase.firestore.Firestore;
    public static initial() {
        var firebaseConfig = {
            apiKey: process.env.REACT_APP_FIREBASE_KEY,
            authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
            databaseURL: `https://${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseio.com`,
            projectId: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}`,
            storageBucket: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
            messagingSenderId: `${process.env.REACT_APP_FIREBASE_SENDER_ID}`,
            appId: `${process.env.REACT_APP_FIREBASE_APP_ID}`,
            measurementId: `${process.env.REACT_APP_FIREBASE_MEASUREMENT_ID}`
        };
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
        this.database = firebase.firestore();

    }

    public static signOut() {
        return firebase.auth().signOut();
    }

    public static onAuthStateChanged(action: (userInput?: User) => void) {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                var userObj = new User();
                userObj.id = user.uid;
                userObj.name = user.displayName ?? '';
                userObj.provider = user.providerId;
                userObj.photoUrl = user.photoURL;
                action(userObj);
            } else {
                action(undefined);
            }

        });
    }

    public static async dbAdd(collection: string, value: object): Promise<string> {
        try {
            let guid = Guid.newGuid();
            let doc = this.database.collection(collection).doc(guid);
            doc.set(value);
            return guid;
        } catch (error) {
            debugger;
            Log.Error(error)
        }
        return '';
    }

    public static async dbGet(collection: string, query: string) {
        return await await this.database.collection(collection).get();

    }

}
