import { UserEntity } from "core/Models/UserEntity";
import { StatesAction } from "core/Redux/Actions/StatesAction";
import { StorageAction } from "core/Redux/Actions/StorageAction";
import { StorageType } from "core/Models/StorageType";
import { SystemActionType } from "./SystemActionType";

export class SystemActions {


    static SaveUserSuccess(currentUser: UserEntity): StatesAction<SystemActionType> {
        return {
            type: SystemActionType.SaveUserSuccess,
            payload: currentUser
        }
    }

    static GoLogin(): StatesAction<SystemActionType> {
        return {
            type: SystemActionType.RemoveCurrentUserSuccess,
            payload: null
        }
    }

    static SaveUser(currentUser: UserEntity): StorageAction<UserEntity, SystemActionType> {
        return new StorageAction<UserEntity, SystemActionType>('user', StorageType.Add, currentUser,
            SystemActions.SaveUserSuccess(currentUser));
    }

}