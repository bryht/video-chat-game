import firebase from "firebase";

export default class AuthHelper {
    public static CurrentUser(){
        return firebase.auth().currentUser;
    }

}
