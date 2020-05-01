import { UserState } from "./UserState";
import { UserRole } from "./UserRole";

export class GameUser {
    name: string;
    uid: string;

    userState: UserState;
    role: UserRole;
    constructor(uid: string, name: string, userState: UserState, role: UserRole) {
        this.name = name;
        this.uid = uid;
        this.userState = userState;
        this.role = role;
    }
}