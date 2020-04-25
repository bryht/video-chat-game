import { User } from "common/Models/User";
export interface IAuthProps {
    currentUser?: User;
    logout: () => void;
}
