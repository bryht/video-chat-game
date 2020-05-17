import FirebaseHelper from "utils/FirebaseHelper";
import { User } from "common/Models/User";

export class RoomData {

    private firebaseHelper: FirebaseHelper;
    public roomUsers: Array<User>;
    constructor(roomId: string) {
        this.firebaseHelper = new FirebaseHelper();
        this.roomUsers = [];
    }

}