import React from "react";
import { User } from "common/Models/User";
import { RouteComponentProps } from "react-router-dom";
import { RouteInfo } from "pages/HomePage/HomePage";
import FirebaseHelper from "utils/FirebaseHelper";
import { IAuthProps } from "./IAuthProps";
interface IAuthStates {
    currentUser?: User;
}
export const AuthenticationConnection = (Component: React.ComponentType<IAuthProps>) => {

    class WithAuthentication extends React.Component<RouteComponentProps<RouteInfo>, IAuthStates> {
        constructor(props: Readonly<RouteComponentProps<RouteInfo>>) {
            super(props);

            this.state = {
                currentUser: undefined
            };
        }

        componentDidMount() {
            FirebaseHelper.onAuthStateChanged(user => {
                this.setState({ currentUser: user });
                if (!user) {
                    this.props.history.push('/login');
                }
            })
        }

        componentDidUpdate() {
            if (!this.state.currentUser) {
                this.props.history.push('/login');
            }
        }
        public render() {
            return (
                <Component currentUser={this.state.currentUser}></Component>
            );
        }
    }
    return WithAuthentication;
}

