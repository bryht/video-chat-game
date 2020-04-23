
import { UserEntity } from "common/Models/UserEntity";
import { Reducer } from 'redux';
import { StatesAction } from "common/Redux/Actions/StatesAction";
import { SystemActionType } from "./SystemActionType";
import { SystemStates } from "./SystemStates";

export const systemReducer: Reducer<SystemStates, StatesAction<SystemActionType>> = (state = new SystemStates(), action) => {
    switch (action.type) {
        case SystemActionType.SaveUserSuccess:
            return { ...state, currentUser: action.payload as UserEntity }
        case SystemActionType.RemoveCurrentUserSuccess:
            return { ...state, currentUser: null }
    }
    return state;
};
