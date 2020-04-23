import { Dispatch } from "redux";
import { UserEntity } from "common/Models/UserEntity";
export interface BasicProps {
    dispatch: Dispatch;
    currentUser: UserEntity | null;
}
