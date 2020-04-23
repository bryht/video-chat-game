import firebase from "firebase";

export default class AuthHelper {
    public static signOut(){
        return firebase.auth().signOut();
    }

}
