import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/analytics';
import { User } from "common/Models/User";
import Log from "./Log";
import Guid from "./Guid";

export default class FirebaseHelper {

    static database: firebase.firestore.Firestore;
    static unregisterAuthObserver: firebase.Unsubscribe;
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
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
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

    public static unregisterAuth() {
        this.unregisterAuthObserver();
    }

    public static async dbAddOrUpdateAsync(collection: string, docId: string, value: object): Promise<void> {
        try {
            let doc = this.database.collection(collection).doc(docId);
            let valuePlain = JSON.parse(JSON.stringify(value));
            await doc.set(valuePlain);
        } catch (error) {
            debugger;
            Log.Error(error)
        }
    }

    public static async dbGetByDocIdAsync<T>(collection: string, docId: string) {
        let doc = await this.database.collection(collection).doc(docId).get();
        if (doc.exists) {
            return doc.data() as T;
        } else {
            return null;
        }

    }

    public static async dbGetAsync<T>(collection: string, query: string) {


    }

    public static dbChanging<T>(collection: string, docId: string, onChanged: (value: T) => void) {
        return this.database.collection(collection).doc(docId).onSnapshot(observer => {
            var changes = observer.data() as T;
            onChanged(changes);
        })
    }

    public static cleanAnonymousUsers() {
        //https://firebase.google.com/docs/admin/setup
        // List batch of users, 1000 at a time.
        // firebase.auth().listUsers(1000, nextPageToken)
        //     .then(function (listUsersResult) {
        //         listUsersResult.users.forEach(function (userRecord) {
        //             console.log('user', userRecord.toJSON());
        //         });
        //         if (listUsersResult.pageToken) {
        //             // List next batch of users.
        //             listAllUsers(listUsersResult.pageToken);
        //         }
        //     })
        //     .catch(function (error) {
        //         console.log('Error listing users:', error);
        //     });
    }

}
