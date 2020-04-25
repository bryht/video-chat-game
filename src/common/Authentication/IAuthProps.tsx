import { User } from "common/Models/User";
import { RouteComponentProps } from "react-router-dom";
export interface IAuthProps<T> extends RouteComponentProps<T> {
    currentUser?: User;
    logout: () => void;
}
